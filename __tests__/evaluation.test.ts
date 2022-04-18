import {
  getSpeakerWithMostSpeechesForYear,
  getSpeakerWithMostTopicSpeeches,
  getSpeakerWithFewestWordsInTotal,
} from '~/lib/evaluation';
import speakerSpeeches from './data/speakerSpeeches.json';

describe('Evaluation', () => {
  test('getSpeakerWithMostSpeechesForYear', () => {
    const speaker = getSpeakerWithMostSpeechesForYear(speakerSpeeches, 2022);
    expect(speaker).toBe('John Doe');
  });

  test('getSpeakerWithMostTopicSpeeches', () => {
    const speaker = getSpeakerWithMostTopicSpeeches(speakerSpeeches, 'Topic Y');
    expect(speaker).toBe('Alice Wondersea');
  });

  test('getSpeakerWithFewestWordsInTotal', () => {
    const speaker = getSpeakerWithFewestWordsInTotal(speakerSpeeches);
    expect(speaker).toBe('Peter Mueller');
  });
});
