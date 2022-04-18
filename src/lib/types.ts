export type EvaluationResult = {
  mostSpeeches: string | null;
  mostSecurity: string | null;
  leastWordy: string | null;
};

export type PoliticalSpeechDataRow = {
  speaker: string;
  topic: string;
  date: string;
  words: string;
};

export type SpeakerName = string;

export type Speech = {
  topic: string;
  year: number;
  words: number;
};

export type SpeechTopic = string;

export type SpeakerSpeeches = {
  [index: SpeakerName]: Speech[];
};
