/* eslint-disable @typescript-eslint/no-explicit-any */
import { RayMount } from '../RayMount';
import type { RayMountOptions } from '../RayMount';

// (jsdom has no 2D canvas: his drawing is a no-op here, and only where he starts is looked at)
beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

const base: RayMountOptions = {
  entrance: 'none',
  state: 'idle',
  idle: 'rest',
  size: 'small',
  isHidden: false,
  shouldReactToPointer: false,
  colorScheme: 'light',
  isOffline: false,
  isListening: false,
};

const actOf = (options: RayMountOptions): unknown => {
  const root = document.createElement('div');
  document.body.append(root);
  const mount = new RayMount(root, options);
  const { act } = mount.debug.holder as { act: string };
  mount.dispose();
  root.remove();
  return act;
};

describe('RayMount', () => {
  it('should bring an answer-row Ray mounted mid-state up out of his row', () => {
    expect(actOf({ ...base, state: 'searching' })).toBe('gone');
  });

  it("should keep a button's Ray in place when he mounts already searching (his film kept loaded ahead)", () => {
    // (a Button's aiHover="ray-investigate": the hover can ask for his search before his code is in; he never rises out of the
    // button's edge first)
    expect(
      actOf({
        ...base,
        state: 'searching',
        preload: 'searching',
        idle: 'rest',
        shouldReactToPointer: false,
      }),
    ).not.toBe('gone');
  });

  it('should keep a hidden Ray out of sight, with or without a film kept loaded ahead', () => {
    expect(actOf({ ...base, isHidden: true })).toBe('gone');
    expect(actOf({ ...base, isHidden: true, state: 'searching', preload: 'searching' })).toBe(
      'gone',
    );
  });

  // (Saurav's review of the hover commit, 7f1579e14: _scale and _lookY, the props Button's Ray hover sets, locked in)
  it("should cap his canvases' pixel ratio at 2, whatever _scale asks", () => {
    const was = Object.getOwnPropertyDescriptor(window, 'devicePixelRatio');
    const ratio = (dpr: number, scale?: number): number => {
      Object.defineProperty(window, 'devicePixelRatio', { value: dpr, configurable: true });
      const root = document.createElement('div');
      document.body.append(root);
      const mount = new RayMount(root, { ...base, scale });
      const r = (mount as any).pixelRatio();
      mount.dispose();
      root.remove();
      return r;
    };
    expect(ratio(1)).toBe(1);
    expect(ratio(1, 1.5)).toBe(1.5); // (_scale: drawn finer as he's shown bigger)
    expect(ratio(2)).toBe(2);
    expect(ratio(2, 3)).toBe(2); // (was 6: 9 times the canvas memory of 2x)
    expect(ratio(3)).toBe(2);
    if (was) Object.defineProperty(window, 'devicePixelRatio', was);
    else Reflect.deleteProperty(window, 'devicePixelRatio');
  });

  it("should move a film's looks by _lookY, and put them back for a Ray without it that takes the film from the pool", () => {
    const shared = { look: [3, 4] as [number, number] }; // (a pose two keys share: moved once)
    const script: { keys: { pose?: { look?: [number, number] } }[]; lookY?: number } = {
      keys: [{ pose: { look: [1, 2] } }, { pose: shared }, { pose: shared }, {}],
    };
    const film = { host: { env: { window: { FILM: { SCRIPT: script } } } } };
    const shift = (lookY?: number): void => {
      const root = document.createElement('div');
      document.body.append(root);
      const mount = new RayMount(root, { ...base, size: 'medium', lookY });
      (mount as any).shiftLooks(film);
      mount.dispose();
      root.remove();
    };
    shift(4); // (a Button's Ray: his eyes 4 px of his box lower)
    const d = script.lookY!;
    expect(d).toBeGreaterThan(0);
    expect(script.keys[0].pose!.look![1]).toBeCloseTo(2 + d);
    expect(shared.look[1]).toBeCloseTo(4 + d);
    expect(script.keys[3].pose!.look).toEqual([0, d]);
    shift(4); // (the same again: nothing moves twice)
    expect(script.keys[0].pose!.look![1]).toBeCloseTo(2 + d);
    shift(undefined); // (a Ray with no _lookY adopts it)
    expect(script.lookY).toBe(0);
    expect(script.keys[0].pose!.look).toEqual([1, expect.closeTo(2)]);
    expect(shared.look).toEqual([3, expect.closeTo(4)]);
    expect(script.keys[3].pose!.look).toEqual([0, expect.closeTo(0)]);
  });
});
