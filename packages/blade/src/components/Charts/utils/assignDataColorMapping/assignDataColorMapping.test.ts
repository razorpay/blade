import type { ChartsCategoricalColorToken } from '../types';
import { assignDataColorMapping } from './assignDataColorMapping';

describe('assignDataColorMapping', () => {
  it('should assign default color when only one key has no color', () => {
    const dataColorMapping = {
      data1: {
        colorToken: undefined,
        isCustomColor: false,
      },
    };
    const themeColors = [
      'data.background.categorical.blue.moderate',
    ] as ChartsCategoricalColorToken[];

    const result = assignDataColorMapping(dataColorMapping, themeColors);

    expect(result.data1.colorToken).toBe('data.background.categorical.gray.moderate');
    expect(result.data1.isCustomColor).toBe(false);
  });

  it('should assign theme colors to keys without colors', () => {
    const dataColorMapping = {
      data1: {
        colorToken: undefined,
        isCustomColor: false,
      },
      data2: {
        colorToken: undefined,
        isCustomColor: false,
      },
    };
    const themeColors = [
      'data.background.categorical.blue.moderate',
      'data.background.categorical.green.moderate',
    ] as ChartsCategoricalColorToken[];

    const result = assignDataColorMapping(dataColorMapping, themeColors);

    expect(result.data1.colorToken).toBe('data.background.categorical.blue.moderate');
    expect(result.data1.isCustomColor).toBe(false);
    expect(result.data2.colorToken).toBe('data.background.categorical.green.moderate');
    expect(result.data2.isCustomColor).toBe(false);
  });

  it('should not override existing colors', () => {
    const themeColors = [
      'data.background.categorical.blue.moderate',
      'data.background.categorical.green.moderate',
    ] as ChartsCategoricalColorToken[];

    const result = assignDataColorMapping(
      {
        data1: {
          colorToken: 'data.background.categorical.red.moderate' as ChartsCategoricalColorToken,
          isCustomColor: true,
        },
        data2: {
          colorToken: undefined,
          isCustomColor: false,
        },
      },
      themeColors,
    );

    expect(result.data1.colorToken).toBe('data.background.categorical.red.moderate');
    expect(result.data1.isCustomColor).toBe(true);
    expect(result.data2.colorToken).toBe('data.background.categorical.green.moderate');
    expect(result.data2.isCustomColor).toBe(false);
  });
});
