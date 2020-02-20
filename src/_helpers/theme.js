import { spacings } from '../tokens';

const getPxScale = (value) => {
  const values = [].concat(value);
  return values.map((v) => (typeof v === 'string' ? v : `${v * spacings.unit}px`)).join(' ');
};

export { getPxScale };
