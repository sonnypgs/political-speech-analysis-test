import '~/init/dotenv';
import express, { Request, Response, Express } from 'express';

const app: Express = express();
const PORT = 3003;

const CSV_URLS = process.env.CSV_URLS;
console.log({ CSV_URLS });

app.get('/', (req: Request, res: Response) => {
  res.send('just testing');
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
