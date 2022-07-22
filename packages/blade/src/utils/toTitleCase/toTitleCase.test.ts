import { toTitleCase } from './toTitleCase';

describe('toTitleCase', () => {
  it('should convert "all small case" to title case', () => {
    const inputString = 'title case';
    const result = 'Title Case';
    expect(toTitleCase(inputString)).toEqual(result);
  });

  it('should convert "all capital case" to title case', () => {
    const inputString = 'TITLE CASE';
    const result = 'Title Case';
    expect(toTitleCase(inputString)).toEqual(result);
  });
});
