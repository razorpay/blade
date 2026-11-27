type Rgb = (c: string) => number[];

/** a fresh copy of rgb() (its one-pixel canvas is made once per module) */
const loadRgb = (): Rgb => {
  let rgb: Rgb | undefined;
  jest.isolateModules(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    ({ rgb } = require('../rgb') as { rgb: Rgb });
  });
  if (!rgb) throw new Error('rgb() did not load');
  return rgb;
};

/** a 2D canvas that paints the colours it knows (as a browser would) and ignores anything else */
const fakeCanvas = (known: Record<string, number[]>): void => {
  let fill = '#000';
  let pixel = [0, 0, 0, 0];
  const context = {
    get fillStyle(): string {
      return fill;
    },
    set fillStyle(value: string) {
      if (value === '#000' || value in known) fill = value;
    },
    clearRect: (): void => {
      pixel = [0, 0, 0, 0];
    },
    fillRect: (): void => {
      pixel = [...(known[fill] ?? [0, 0, 0]), 255];
    },
    getImageData: (): { data: number[] } => ({ data: pixel }),
  };
  jest
    .spyOn(HTMLCanvasElement.prototype, 'getContext')
    .mockReturnValue((context as unknown) as CanvasRenderingContext2D);
};

afterEach(() => jest.restoreAllMocks());

describe('ButtonRay rgb()', () => {
  it('reads every length of hex', () => {
    const rgb = loadRgb();
    expect(rgb('#1a2b3c')).toEqual([26, 43, 60]);
    expect(rgb('#fff')).toEqual([255, 255, 255]);
    expect(rgb('#0f08')).toEqual([0, 255, 0]);
    expect(rgb('#1A2B3C80')).toEqual([26, 43, 60]);
  });

  it('reads rgb() and hsl(), old and new syntax', () => {
    const rgb = loadRgb();
    expect(rgb('rgb(12, 34, 56)')).toEqual([12, 34, 56]);
    expect(rgb('rgba(12,34,56,0.5)')).toEqual([12, 34, 56]);
    expect(rgb('rgb(12 34 56 / 50%)')).toEqual([12, 34, 56]);
    expect(rgb('hsl(0, 100%, 50%)')).toEqual([255, 0, 0]);
    expect(rgb('hsl(240deg 100% 50% / 0.4)')).toEqual([0, 0, 255]);
    // (numbers written with a leading or trailing dot)
    expect(rgb('rgb(.5, 12., 56)')).toEqual([1, 12, 56]);
  });

  it('reads any other colour from what the browser paints for it', () => {
    fakeCanvas({ white: [255, 255, 255], 'oklch(0.5 0.2 30)': [190, 40, 40] });
    const rgb = loadRgb();
    expect(rgb('white')).toEqual([255, 255, 255]);
    expect(rgb('oklch(0.5 0.2 30)')).toEqual([190, 40, 40]);
  });

  it('never gives NaN: anything that is not a colour is black', () => {
    fakeCanvas({});
    const rgb = loadRgb();
    [
      '#ggg',
      '#12345',
      'rgb(100%, 0%, 0%)',
      'var(--x)',
      '',
      // (a stray dot or a doubled one: not numbers, so not read here)
      'rgb(., 0, 0)',
      'rgb(1.2.3, 0, 0)',
      'rgba(0, ., 0, 1)',
      'hsl(., 50%, 50%)',
      'hsl(0, .%, 50%)',
    ].forEach((c) => {
      const out = rgb(c);
      expect(out).toHaveLength(3);
      out.forEach((v) => expect(Number.isFinite(v)).toBe(true));
    });
    expect(rgb('not a colour')).toEqual([0, 0, 0]);
    expect(rgb('rgb(., 0, 0)')).toEqual([0, 0, 0]);
  });

  it('is black where there is no 2D canvas', () => {
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    expect(loadRgb()('white')).toEqual([0, 0, 0]);
  });
});
