import fs from 'fs';
import path from 'path';

export function getBadWordsList() {
  const filePath = path.join(__dirname, 'badWords.txt');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return fileContent.split('\n').map(word => word.trim());
}

export function hasBadWords(sentence: string) {
  const badWords = getBadWordsList();
  const wordsInSentence = sentence.toLowerCase().split(' ');

  for (let word of wordsInSentence) {
    if (badWords.includes(word)) {
      return true;
    }
  }
  return false;
}

export function getBadWordsInSentence(sentence:string) {
  const badWords = getBadWordsList();
  const wordsInSentence = sentence.toLowerCase().split(' ');

  return wordsInSentence.filter(word => badWords.includes(word));
}
