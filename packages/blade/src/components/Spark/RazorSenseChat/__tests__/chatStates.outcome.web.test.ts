import { ChatStates } from '../chatStates';
import type { ChatStateInputs, OutcomeMemory } from '../chatStates';
import type { ChatAnchors, ChatDriver } from '../chatDriver';
import type { FreshDoc, FreshEngine } from '../../RazorSenseEngine';

// An outcome plays once each time it's set, and once each answer. The component keeps the one last played across its ChatStates: a
// new color scheme or scale makes new ones (the PR review: an error set minutes before replayed its red wave on a theme switch).
// The chat thinking again forgets it, so the same outcome set for the next answer plays again.

jest.mock('../outcome', () => ({
  spliceOutcome: (doc: unknown) => ({ doc, t0: 10, t1: 13.7 }),
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
    clearOutcome: jest.fn(),
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
