/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-var-requires */
// A component that no longer wants to start by the time its turn comes (a RazorSenseLoader finished while it waited) starts
// nothing, and what was made ahead for it is freed: no engine left running for a component that's done.

type Turn = { go: () => unknown; prepare?: () => boolean };

const setup = (): { runFreshStage: any; turns: Turn[]; createEngine: jest.Mock } => {
  const turns: Turn[] = [];
  jest
    .spyOn(HTMLCanvasElement.prototype, 'getContext')
    .mockImplementation(((type: string) =>
      type === 'webgl2' ? { getExtension: () => null, getParameter: () => '' } : null) as any);
  const createEngine = jest.fn();
  let runFreshStage: any;
  jest.isolateModules(() => {
    jest.doMock('../startQueue', () => ({
      waitForTurn: (_box: Element, go: Turn['go'], prepare?: Turn['prepare']) => {
        turns.push({ go, prepare });
        return () => undefined;
      },
    }));
    jest.doMock('../loadFreshEngine', () => ({
      loadFreshEngine: () => Promise.resolve(createEngine),
    }));
    ({ runFreshStage } = require('../runFreshStage'));
  });
  return { runFreshStage, turns, createEngine };
};

const flush = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

describe('runFreshStage: wanting to start at its turn', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('starts nothing, and frees what was made ahead, when its turn comes after it stopped wanting to', async () => {
    const { runFreshStage, turns } = setup();
    let isWanted = true;
    const box = document.createElement('div');
    document.body.append(box);
    const stageRef = { current: null as any };
    const start = jest.fn(() => true);
    const stop = runFreshStage({
      moduleName: 'Test',
      getBox: () => box,
      stageRef,
      loadComps: () => Promise.resolve({}),
      shouldStart: () => isWanted,
      start,
      engineAlpha: false,
      onFail: jest.fn(),
      onRelease: jest.fn(),
    });
    await flush();
    expect(turns).toHaveLength(1);
    // its first step made ahead while it still wanted to start: a stage (and its canvas) on the box
    turns[0].prepare?.();
    expect(stageRef.current).not.toBeNull();
    expect(box.querySelector('canvas')).not.toBeNull();

    // done before its turn: nothing starts, and the stage made ahead is gone
    isWanted = false;
    expect(turns[0].prepare?.()).toBe(true);
    expect(turns[0].go()).toBeNull();
    expect(start).not.toHaveBeenCalled();
    expect(stageRef.current).toBeNull();
    expect(box.querySelector('canvas')).toBeNull();
    stop();
    box.remove();
  });

  it('starts at its turn while it still wants to', async () => {
    const { runFreshStage, turns } = setup();
    const box = document.createElement('div');
    document.body.append(box);
    const stageRef = { current: null as any };
    const start = jest.fn(() => true);
    const stop = runFreshStage({
      moduleName: 'Test',
      getBox: () => box,
      stageRef,
      loadComps: () => Promise.resolve({}),
      shouldStart: () => true,
      start,
      onFail: jest.fn(),
      onRelease: jest.fn(),
    });
    await flush();
    expect(typeof turns[0].go()).toBe('function');
    expect(start).toHaveBeenCalledTimes(1);
    stop();
    box.remove();
  });
});
