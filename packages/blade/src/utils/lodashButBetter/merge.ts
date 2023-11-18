/* eslint-disable prefer-object-spread */
function merge<T, U>(target: T, source: U): T & U {
  return Object.assign({}, target, source);
}

export default merge;
