import type { FileInfo } from 'jscodeshift';
import * as tokenMapping from './motionTokenMapping.json';

export default function transformer(file: FileInfo) {
  // Fairly simple usecases of motion tokens in razorpay files so this works.
  // .replace has also worked well during rebranding
  const newSource = file.source.replace(/motion\.easing\.[\w\.]+/g, (matchingToken) => {
    const match = Object.entries(tokenMapping).find(
      ([oldToken, _newToken]) => oldToken === matchingToken,
    );

    if (match) {
      return match[1];
    }

    return matchingToken;
  });

  return newSource;
}
