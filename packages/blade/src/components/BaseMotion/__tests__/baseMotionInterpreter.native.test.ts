import { resolveVariantStyle, parseTransform, parseUnit, getTiming } from '../baseMotionInterpreter.native';

beforeAll(() => jest.spyOn(console, 'warn').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('parseUnit', () => {
  it('should parse px values', () => {
    expect(parseUnit('16px')).toBe(16);
    expect(parseUnit('0px')).toBe(0);
  });

  it('should parse unitless numbers', () => {
    expect(parseUnit('42')).toBe(42);
  });

  it('should parse raw numbers', () => {
    expect(parseUnit('100')).toBe(100);
  });

  it('should return 0 for NaN', () => {
    expect(parseUnit('abc')).toBe(0);
  });

  it('should resolve vw against window width', () => {
    const result = parseUnit('50vw', { width: 400, height: 800 });
    expect(result).toBe(200);
  });

  it('should resolve vh against window height', () => {
    const result = parseUnit('25vh', { width: 400, height: 800 });
    expect(result).toBe(200);
  });

  it('should degrade percentage values to 0', () => {
    expect(parseUnit('50%')).toBe(0);
    expect(parseUnit('0%')).toBe(0);
  });
});

describe('parseTransform', () => {
  it('should return empty for undefined', () => {
    expect(parseTransform(undefined)).toEqual({});
  });

  it('should return empty for null', () => {
    expect(parseTransform(null as unknown as undefined)).toEqual({});
  });

  it('should parse translateX', () => {
    expect(parseTransform('translateX(16px)')).toEqual({ translateX: 16 });
  });

  it('should parse translateY', () => {
    expect(parseTransform('translateY(24px)')).toEqual({ translateY: 24 });
  });

  it('should parse scale', () => {
    expect(parseTransform('scale(1.5)')).toEqual({ scale: 1.5 });
  });

  it('should parse rotate', () => {
    expect(parseTransform('rotate(45)')).toEqual({ rotate: 45 });
  });

  it('should parse multiple transforms in one string', () => {
    const result = parseTransform('translateX(10px) translateY(20px) scale(2)');
    expect(result).toEqual({ translateX: 10, translateY: 20, scale: 2 });
  });

  it('should use the last entry from a keyframe array', () => {
    const result = parseTransform(['translateY(16px)', 'translateY(0px)']);
    expect(result).toEqual({ translateY: 0 });
  });
});

describe('resolveVariantStyle', () => {
  it('should return empty for undefined variant', () => {
    expect(resolveVariantStyle(undefined)).toEqual({});
  });

  it('should resolve opacity', () => {
    expect(resolveVariantStyle({ opacity: 0.5 })).toEqual({ opacity: 0.5 });
  });

  it('should resolve scale', () => {
    expect(resolveVariantStyle({ scale: 2 })).toEqual({ scale: 2 });
  });

  it('should resolve x/y as translateX/translateY', () => {
    expect(resolveVariantStyle({ x: 10, y: 20 })).toEqual({ translateX: 10, translateY: 20 });
  });

  it('should resolve rotate', () => {
    expect(resolveVariantStyle({ rotate: 90 })).toEqual({ rotate: 90 });
  });

  it('should resolve borderRadius', () => {
    expect(resolveVariantStyle({ borderRadius: 8 })).toEqual({ borderRadius: 8 });
  });

  it('should resolve backgroundColor', () => {
    expect(resolveVariantStyle({ backgroundColor: '#ff0000' })).toEqual({ backgroundColor: '#ff0000' });
  });

  it('should resolve color', () => {
    expect(resolveVariantStyle({ color: '#00ff00' })).toEqual({ color: '#00ff00' });
  });

  it('should resolve transform string', () => {
    expect(resolveVariantStyle({ transform: 'translateY(16px)' })).toEqual({ translateY: 16 });
  });

  it('should resolve all supported keys together', () => {
    const result = resolveVariantStyle({
      opacity: 0,
      scale: 1.2,
      x: 10,
      y: 20,
      rotate: 45,
      borderRadius: 8,
      backgroundColor: '#fff',
      color: '#000',
    });
    expect(result).toEqual({
      opacity: 0,
      scale: 1.2,
      translateX: 10,
      translateY: 20,
      rotate: 45,
      borderRadius: 8,
      backgroundColor: '#fff',
      color: '#000',
    });
  });

  it('should resolve keyframe arrays to last value', () => {
    expect(resolveVariantStyle({ opacity: [0, 0.5, 1] })).toEqual({ opacity: 1 });
  });
});

describe('getTiming', () => {
  it('should use default duration when transition is undefined', () => {
    const result = getTiming(undefined);
    expect(result.duration).toBe(300);
  });

  it('should use transition duration (seconds to ms)', () => {
    const result = getTiming({ duration: 0.5 });
    expect(result.duration).toBe(500);
  });

  it('should use default duration when transition.duration is not a number', () => {
    const result = getTiming({ duration: 'invalid' as unknown as number });
    expect(result.duration).toBe(300);
  });
});
