import type { FileInfo } from 'jscodeshift';
// eslint-disable-next-line import/extensions
import * as tokenMapping from './motionTokenMapping.json';

const transformer = (file: FileInfo): string => {
  // Fairly simple usecases of motion tokens in razorpay files so this works.
  // .replace has also worked well during rebranding
  // eslint-disable-next-line no-useless-escape
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
};

export default transformer;
