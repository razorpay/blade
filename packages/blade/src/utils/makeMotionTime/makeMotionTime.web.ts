export const makeMotionTime = <T extends number>(time: T): `${T}ms` => {
  return `${time}ms`;
};
