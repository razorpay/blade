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

const alphabetize = (number: number): string => {
  const alphabets = 'abcdefghijklmnopqrstuvwxyz';
  const firstAlphabets = number >= 26 ? alphabetize(Math.floor(number / 26) - 1) : '';
  const lastAlphabet = alphabets[number % 26];
  return `${firstAlphabets}${lastAlphabet}`;
};

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
