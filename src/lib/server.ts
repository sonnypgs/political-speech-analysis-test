import express, { Request, Response, Express } from 'express';
import { EvaluationResult, PoliticalSpeechDataRow } from '~/lib/types';
import {
  extractCSVUrls,
  fetchPSDataRows,
  evaluatePSDataRows,
} from '~/lib/evaluation';

//
// Inititalize
//

const server: Express = express();

//
// Middleware
//

server.use(express.static('public'));

//
// Routes
//

server.get('/evaluation', async (req: Request, res: Response) => {
  const { query } = req;

  let urls: string[] = extractCSVUrls(query);
  let rows: PoliticalSpeechDataRow[] = await fetchPSDataRows(urls);
  const result: EvaluationResult = evaluatePSDataRows(rows);

  res.json(result);
});

export default server;
