import { ChatStates } from '../chatStates';
import type { ChatAnchors, ChatDriver } from '../chatDriver';
import type { FreshDoc, FreshEngine } from '../../RazorSenseEngine';

// A chunk that fails to load (a deploy removed the old chunks: a 404) isn't asked for again. Asked each frame, it was a request a
// frame (the PR review). The strip stays as it is: no outcome, no voice look.

let mockOutcomeTries = 0;
let mockVoiceTries = 0;
jest.mock('../outcome', () => {
  mockOutcomeTries += 1;
  throw new Error('404');
});
jest.mock('../voiceBottom', () => {
  mockVoiceTries += 1;
  throw new Error('404');
});

const flush = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

describe('ChatStates: a chunk that fails to load', () => {
  it('is asked for once, however many frames want it', async () => {
    window.requestIdleCallback = ((cb: () => void) => {
      cb();
      return 1;
    }) as typeof window.requestIdleCallback;
    const engine = { load: jest.fn(() => true), player: { look: jest.fn(), tools: {} } };
    const driver = ({
      setDrop: jest.fn(),
      isAtRest: () => true,
      restComp: () => 'c3',
      clearOutcome: jest.fn(),
      playOutcome: jest.fn(),
    } as unknown) as ChatDriver;
    const anchors = ({
      bar: { top: 600, width: 840, height: 60 },
      leaveAt: 800,
    } as unknown) as ChatAnchors;
    const states = new ChatStates(
      (engine as unknown) as FreshEngine,
      ({} as unknown) as FreshDoc,
      {},
      'light',
      1,
    );
    states.inputs = { isOffline: false, isListening: true, outcome: 'success' };
    let now = 1000;
    for (let s = 0; s < 5; s++) {
      for (let i = 0; i < 30; i++) states.frame(1 / 60, (now += 1000 / 60), driver, anchors);
      // eslint-disable-next-line no-await-in-loop
      await flush();
    }
    expect(mockOutcomeTries).toBe(1);
    expect(mockVoiceTries).toBe(1);
    expect(((driver as unknown) as { playOutcome: jest.Mock }).playOutcome).not.toHaveBeenCalled();
    states.destroy();
  });
});
