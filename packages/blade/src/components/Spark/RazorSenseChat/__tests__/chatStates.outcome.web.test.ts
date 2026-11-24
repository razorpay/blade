import { ChatStates } from '../chatStates';
import type { ChatStateInputs, OutcomeMemory } from '../chatStates';
import type { ChatAnchors, ChatDriver } from '../chatDriver';
import type { FreshDoc, FreshEngine } from '../../RazorSenseEngine';

// An outcome plays once each time it's set, and once each answer. The component keeps the one last played across its ChatStates: a
// new color scheme or scale makes new ones (the PR review: an error set minutes before replayed its red wave on a theme switch).
// The chat thinking again forgets it, so the same outcome set for the next answer plays again.

// (each outcome's piece at its own place on the strip's clock: success from 10, error from 20)
jest.mock('../outcome', () => ({
  spliceOutcome: (doc: unknown, outcome: string) =>
    outcome === 'error' ? { doc, t0: 20, t1: 23.7 } : { doc, t0: 10, t1: 13.7 },
}));

const flush = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

const setup = (
  memory: OutcomeMemory,
): {
  states: ChatStates;
  driver: ChatDriver & { playOutcome: jest.Mock };
  run: (inputs: ChatStateInputs) => void;
} => {
  const engine = { load: jest.fn(() => true), player: { look: jest.fn(), tools: {} } };
  const driver = ({
    setDrop: jest.fn(),
    isAtRest: () => true,
    restComp: () => 'c3',
    hurryOutcome: jest.fn(),
    playOutcome: jest.fn(),
  } as unknown) as ChatDriver & { playOutcome: jest.Mock };
  const anchors = ({
    bar: { top: 600, width: 840, height: 60 },
    leaveAt: 800,
  } as unknown) as ChatAnchors;
  const states = new ChatStates(
    (engine as unknown) as FreshEngine,
    ({} as unknown) as FreshDoc,
    {},
    'dark',
    1,
    undefined,
    memory,
  );
  let now = 1000;
  const run = (inputs: ChatStateInputs): void => {
    states.inputs = inputs;
    for (let i = 0; i < 3; i++) states.frame(1 / 60, (now += 1000 / 60), driver, anchors);
  };
  return { states, driver, run };
};

/** its outcomes' chunk in (as fetched while it thinks) */
const withOutcomes = async (states: ChatStates): Promise<void> => {
  window.requestIdleCallback = ((cb: () => void) => {
    cb();
    return 1;
  }) as typeof window.requestIdleCallback;
  states.prefetchOutcome();
  await flush();
};

describe('ChatStates: an outcome plays once', () => {
  it('a new color scheme or scale (new states, the same memory) doesn’t play the outcome again', async () => {
    const memory: OutcomeMemory = {};
    const first = setup(memory);
    await withOutcomes(first.states);
    first.run({ isOffline: false, isListening: false, outcome: 'error' });
    expect(first.driver.playOutcome).toHaveBeenCalledTimes(1);
    first.states.destroy();
    // the theme switched: the component's states made again, the outcome still set
    const next = setup(memory);
    await withOutcomes(next.states);
    next.run({ isOffline: false, isListening: false, outcome: 'error' });
    expect(next.driver.playOutcome).not.toHaveBeenCalled();
    next.states.destroy();
  });

  it('the same outcome left set for the next answer plays again once the chat has thought again', async () => {
    const memory: OutcomeMemory = {};
    const { states, driver, run } = setup(memory);
    await withOutcomes(states);
    run({ isOffline: false, isListening: false, outcome: 'success' });
    run({ isOffline: false, isListening: false, outcome: 'success' });
    expect(driver.playOutcome).toHaveBeenCalledTimes(1);
    // a new question (useChatStage forgets the last one played as the chat thinks), then its answer
    memory.played = undefined;
    run({ isOffline: false, isListening: false, outcome: 'success' });
    expect(driver.playOutcome).toHaveBeenCalledTimes(2);
    states.destroy();
  });
});

describe('ChatStates: another outcome set while one plays', () => {
  // the user: success nearly over, then Finish with error ran success backwards before the error played
  const make = (): {
    states: ChatStates;
    driver: ChatDriver & Record<string, jest.Mock>;
    anchors: ChatAnchors;
    playing: { on: boolean };
  } => {
    const playing = { on: false };
    const engine = { load: jest.fn(() => true), player: { look: jest.fn(), tools: {} } };
    const driver = ({
      setDrop: jest.fn(),
      isAtRest: () => !playing.on,
      restComp: () => 'c3',
      hurryOutcome: jest.fn(),
      endOutcome: jest.fn(() => {
        playing.on = false;
      }),
      holdOutcome: jest.fn(),
      playOutcome: jest.fn(() => {
        playing.on = true;
      }),
    } as unknown) as ChatDriver & Record<string, jest.Mock>;
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
      undefined,
      {},
    );
    return { states, driver, anchors, playing };
  };

  it('the one playing plays out (hurried, not cleared backwards), then the new one plays from the strip’s rest', async () => {
    const { states, driver, anchors, playing } = make();
    await withOutcomes(states);
    let now = 1000;
    const run = (inputs: ChatStateInputs): void => {
      states.inputs = inputs;
      for (let i = 0; i < 3; i++) states.frame(1 / 60, (now += 1000 / 60), driver, anchors);
    };
    run({ isOffline: false, isListening: false, outcome: 'success' });
    expect(driver.playOutcome).toHaveBeenLastCalledWith(10, expect.closeTo(3.7, 5));
    // (as the story sets it: cleared, then the next one)
    run({ isOffline: false, isListening: false, outcome: undefined });
    run({ isOffline: false, isListening: false, outcome: 'error' });
    expect(driver.hurryOutcome).toHaveBeenCalled();
    expect(driver.playOutcome).toHaveBeenCalledTimes(1);
    // (success played out: the strip at rest)
    playing.on = false;
    run({ isOffline: false, isListening: false, outcome: 'error' });
    expect(driver.playOutcome).toHaveBeenCalledTimes(2);
    expect(driver.playOutcome).toHaveBeenLastCalledWith(20, expect.closeTo(3.7, 5));
    states.destroy();
  });

  it('with reduced motion, the new one shows its own moment in place of the one shown', async () => {
    const { states, driver, anchors } = make();
    await withOutcomes(states);
    states.inputs = { isOffline: false, isListening: false, outcome: 'success' };
    states.settle(driver, anchors);
    expect(driver.playOutcome).toHaveBeenLastCalledWith(10, expect.closeTo(3.7, 5));
    states.inputs = { isOffline: false, isListening: false, outcome: 'error' };
    states.settle(driver, anchors);
    expect(driver.endOutcome).toHaveBeenCalled();
    expect(driver.playOutcome).toHaveBeenLastCalledWith(20, expect.closeTo(3.7, 5));
    expect(driver.holdOutcome).toHaveBeenCalledTimes(2);
    states.destroy();
  });
});
