import axios from 'axios';
import QueryString from 'qs';
import { parse as parseDate } from 'date-fns';
import { parse as parseCSV } from 'csv-parse/sync';
// import { parse } from 'csv-parse/lib/sync';
import {
  EvaluationResult,
  PoliticalSpeechDataRow,
  SpeakerSpeeches,
  Speech,
  SpeakerName,
  SpeechTopic,
} from './types';

//
// Evaluation
//

export function extractCSVUrls(query: QueryString.ParsedQs): string[] {
  let urls: string[] = [];

  let queryUrl = query?.url;
  if (typeof queryUrl == 'string') {
    urls = [queryUrl];
  } else if (Array.isArray(queryUrl)) {
    urls = queryUrl as string[];
  }

  return urls;
}

//

export async function fetchPSDataRows(
  urls: string[]
): Promise<PoliticalSpeechDataRow[]> {
  let rows: PoliticalSpeechDataRow[] = [];

  for await (const url of urls as string[]) {
    try {
      const resp = await axios.get(url);
      const { data } = resp;
      const processedData: PoliticalSpeechDataRow[] =
        await processPoliticalSpeechCSV(data);
      rows = rows.concat(processedData);
    } catch (error) {
      console.log({ error });
    }
  }

  return rows;
}

//

export function processPoliticalSpeechCSV(
  data: string
): PoliticalSpeechDataRow[] {
  let records: PoliticalSpeechDataRow[] = [];

  try {
    const headers = ['speaker', 'topic', 'date', 'words'];
    records = parseCSV(data, {
      delimiter: ',',
      fromLine: 2,
      columns: headers,
      skipEmptyLines: true,
    });
  } catch (error) {
    console.log(error);
  }

  return records;
}

//

export function evaluatePSDataRows(
  rows: PoliticalSpeechDataRow[]
): EvaluationResult {
  const speakerSpeeches: SpeakerSpeeches = {};

  // Iterate over the rows
  for (const row of rows) {
    const { speaker, date, topic, words } = row;

    // Transformations
    const speakerT = speaker.trim();
    const dateParsed = parseDate(date.trim(), 'yyyy-MM-dd', new Date());

    // Build speech
    const speech: Speech = {
      topic: topic.trim(),
      words: parseInt(words.trim()),
      year: dateParsed.getFullYear(),
    };

    // Append speech
    if (speakerT in speakerSpeeches) {
      speakerSpeeches[speakerT].push(speech);
    } else {
      speakerSpeeches[speakerT] = [speech];
    }
  }

  // Object.entries((entry: Speech) => console.log(entry));

  // 1) Most speeches in 2013?
  let mostSpeeches: SpeakerName | null = getSpeakerWithMostSpeechesForYear(
    speakerSpeeches,
    2013
  );

  // 2) Most speeches on topic 'Internal Security'?
  let mostSecurity: SpeakerName | null = getSpeakerWithMostTopicSpeeches(
    speakerSpeeches,
    'Internal Security'
  );

  // 3) Fewest words in total
  let leastWordy: SpeakerName | null =
    getSpeakerWithFewestWordsInTotal(speakerSpeeches);

  return {
    mostSpeeches,
    mostSecurity,
    leastWordy,
  };
}

//

export function getSpeakerWithMostSpeechesForYear(
  data: SpeakerSpeeches,
  year: number
): SpeakerName | null {
  if (data === undefined || data === null) return null;
  if (year === undefined || year === null) return null;

  const speakerCountsSorted = Object.entries(data)
    .map(([speakerName, speeches]) => {
      const speechesOfYearCount = speeches
        .map((speech) => (speech.year === year ? speech : null))
        .filter((s) => s).length;

      return [speakerName, speechesOfYearCount];
    })
    .sort((speakerA, speakerB) => {
      // (a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0)
      if (speakerA[1] < speakerB[1]) {
        return 1;
      } else if (speakerA[1] > speakerB[1]) {
        return -1;
      } else {
        return 0;
      }
    });

  // Remove speakers with no speeches
  const speakerCountsFiltered = speakerCountsSorted.filter((s) => s[1] > 0);

  if (speakerCountsFiltered?.length > 0) {
    return speakerCountsSorted[0][0] as SpeakerName;
  }

  return null;
}

//

export function getSpeakerWithMostTopicSpeeches(
  data: SpeakerSpeeches,
  topic: SpeechTopic
): SpeakerName | null {
  if (data === undefined || data === null) return null;
  if (topic === undefined || topic === null) return null;

  const speakerCountsSorted = Object.entries(data)
    .map(([speakerName, speeches]) => {
      const speechesOfYearCount = speeches
        .map((speech) => (speech.topic === topic ? speech : null))
        .filter((s) => s).length;

      return [speakerName, speechesOfYearCount];
    })
    .sort((speakerA, speakerB) => {
      if (speakerA[1] < speakerB[1]) {
        return 1;
      } else if (speakerA[1] > speakerB[1]) {
        return -1;
      } else {
        return 0;
      }
    });

  // Remove speakers with no speeches
  const speakerCountsFiltered = speakerCountsSorted.filter((s) => s[1] > 0);

  if (speakerCountsFiltered?.length > 0) {
    return speakerCountsSorted[0][0] as SpeakerName;
  }

  return null;
}

//

export function getSpeakerWithFewestWordsInTotal(
  data: SpeakerSpeeches
): SpeakerName | null {
  if (data === undefined || data === null) return null;

  const speakerCountsSorted = Object.entries(data)
    .map(([speakerName, speeches]) => {
      const words = speeches.map((speech) => speech.words);
      const wordsAverage = words.reduce((pv, cv) => pv + cv) / words?.length;

      return [speakerName, wordsAverage];
    })
    .sort((speakerA, speakerB) => {
      if (speakerA[1] > speakerB[1]) {
        return 1;
      } else if (speakerA[1] < speakerB[1]) {
        return -1;
      } else {
        return 0;
      }
    });

  // Remove speakers with no speeches
  const speakerCountsFiltered = speakerCountsSorted.filter((s) => s[1] > 0);

  if (speakerCountsFiltered?.length > 0) {
    return speakerCountsSorted[0][0] as SpeakerName;
  }

  return null;
}
