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
});
