import fs from 'fs';
import path from 'path';

export class WordModerationService {
  getBadWordsList() {
    const filePath = path.join(__dirname, 'badWords.txt');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return fileContent.split('\n').map(word => word.trim());
  }

  async hasBadWords(textInput: string) {
    const badWords = this.getBadWordsList();
    const wordsFromInput = textInput.toLowerCase().split(' ');

    for (let word of wordsFromInput) {
      if (badWords.includes(word)) {
        return true;
      }
    }
    return false;
  }

  async getBadWordsFromInput(textInput: string) {
    const badWords = this.getBadWordsList();
    const wordsFromInput = textInput.toLowerCase().split(' ');

    return wordsFromInput.filter(word => badWords.includes(word));
  }
}
