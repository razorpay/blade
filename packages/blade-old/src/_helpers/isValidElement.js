import { isValidElementType } from 'react-is';

const isValidElement = (element) => {
  if (typeof element === 'string' || typeof element === 'number') return false;
  return isValidElementType(element);
};

export default isValidElement;
