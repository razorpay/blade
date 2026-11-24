import { ChatStates } from '../chatStates';
import type { ChatAnchors, ChatDriver } from '../chatDriver';
import type { FreshDoc, FreshEngine } from '../../RazorSenseEngine';

// A chunk that fails to load (a deploy removed the old chunks: a 404, or offline) is asked for again only 30 s later: asked each frame,
// it was a request a frame (the PR review); never again, one that failed offline was gone for the session (the second review).

let mockOutcomeTries = 0;
let mockVoiceTries = 0;
let mockIsOnline = false;
jest.mock('../outcome', () => {
  mockOutcomeTries += 1;
  if (!mockIsOnline) throw new Error('404');
  return { spliceOutcome: (doc: unknown) => ({ doc, t0: 10, t1: 13.7 }) };
});
jest.mock('../voiceBottom', () => {
  mockVoiceTries += 1;
  throw new Error('404');
});

const flush = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

describe('ChatStates: a chunk that fails to load', () => {
  it('is asked for once, however many frames want it, and again 30 s later', async () => {
    let clock = 1000;
    jest.spyOn(performance, 'now').mockImplementation(() => clock);
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
    const frames = async (seconds: number): Promise<void> => {
      for (let s = 0; s < seconds; s++) {
        for (let i = 0; i < 30; i++) states.frame(1 / 60, (clock += 1000 / 30), driver, anchors);
        // eslint-disable-next-line no-await-in-loop
        await flush();
      }
    };
    try {
      await frames(5);
      expect(mockOutcomeTries).toBe(1);
      expect(mockVoiceTries).toBe(1);
      expect(
        ((driver as unknown) as { playOutcome: jest.Mock }).playOutcome,
      ).not.toHaveBeenCalled();
      // back online: within 30 s of the failure it waits; past it, it's asked for again, once, and the outcome plays
      mockIsOnline = true;
      await frames(20);
      expect(mockOutcomeTries).toBe(1);
      await frames(8);
      expect(mockOutcomeTries).toBe(2);
      expect(((driver as unknown) as { playOutcome: jest.Mock }).playOutcome).toHaveBeenCalledTimes(
        1,
      );
      expect(mockVoiceTries).toBe(2);
    } finally {
      states.destroy();
      jest.restoreAllMocks();
    }
  });
});
