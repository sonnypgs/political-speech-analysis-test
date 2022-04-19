import request from 'supertest';
import '~/init/dotenv';
import server from '~/lib/server';

const app = server.listen(process.env.SERVER_PORT);

let csvUrls: any = [];
if (process.env.CSV_URLS) {
  const urls = process.env.CSV_URLS as string;
  if (urls !== undefined) {
    csvUrls = urls;
    if (typeof urls === 'string') {
      csvUrls = [urls];
    }
  }
}

describe('API', () => {
  test('GET /evaluation', (done) => {
    request(server).get('/evaluation').expect(200).end(done);
  });

  test('GET /evaluation/?url=<ps-1.csv>&url=<ps-2.csv>', (done) => {
    const params = new URLSearchParams();
    for (const url of csvUrls) {
      params.append('url', url);
    }

    request(server)
      .get(`/evaluation/?${params.toString()}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({
        mostSpeeches: null,
        mostSecurity: 'Alexander Abel',
        leastWordy: 'Caesare Collins',
      })
      .end(done);
  });
});

afterAll(() => {
  app.close();
});
