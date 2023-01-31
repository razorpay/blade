/**
 * Converts number to roman number
 *
 * @param {number} number
 * @returns {string} roman number
 */
const romanize = (number: number): string => {
  const romanKeys: Record<string, number> = {
    m: 1000,
    cm: 900,
    d: 500,
    cd: 400,
    c: 100,
    xc: 90,
    l: 50,
    xl: 40,
    x: 10,
    ix: 9,
    v: 5,
    iv: 4,
    i: 1,
  };
  let result = '';

  Object.keys(romanKeys).forEach((key) => {
    result += key.repeat(Math.floor(number / romanKeys[key]));
    number %= romanKeys[key];
  });

  return result;
};

/**
 * Converts number to alphabet. After 26 letters, the output will contain 2 alphabets eg) aa, ab, ac,...
 *
 * @param {number} number
 * @returns {string} alphabet
 */
const alphabetize = (number: number): string => {
  // Decrement the input number since array starts with 0. Eg) 'a' will be at 0th position and not 1st position in the array.
  const indexedNumber = --number;
  const alphabets = 'abcdefghijklmnopqrstuvwxyz';
  const firstAlphabets = indexedNumber >= 26 ? alphabetize(Math.floor(indexedNumber / 26) - 1) : '';
  const lastAlphabet = alphabets[indexedNumber % 26];
  return `${firstAlphabets}${lastAlphabet}`;
};

/**
 * Get the list item bullet number/roman number/alphabet for the passed level and list item number
 *
 * @param {{itemNumber: number, level: number}} { itemNumber, level }
 * @returns {string} OrderedList bullet
 */
const getOrderedListItemBullet = ({
  itemNumber,
  level,
}: {
  itemNumber: number;
  level: number;
}): string => {
  if (isNaN(itemNumber)) return '';
  switch (level) {
    case 1:
      return `${itemNumber}`;
    case 2:
      return `${alphabetize(--itemNumber)}`;
    case 3:
      return `${romanize(itemNumber)}`;
    default:
      return `${itemNumber}`;
  }
};

export { getOrderedListItemBullet };
