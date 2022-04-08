import makeBezier from './makeBezier.web';

describe('makeBezier', () => {
  it.only(`should return a string of cubic-bezier with the right parameters`, () => {
    const easing = makeBezier(0.5, 1, 0, 1.5);
    expect(easing).toBe('cubic-bezier(0.5, 1, 0, 1.5)');
  });
});
