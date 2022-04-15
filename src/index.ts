import express, { Request, Response, Express } from 'express';

const app: Express = express();
const PORT = 3003;

app.get('/', (req: Request, res: Response) => {
  res.send('just testing');
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
