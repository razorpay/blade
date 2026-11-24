/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-var-requires */
// onLoad means drawn: a component hears its first frame is on its canvas (onDrawn), not that its engine was made or started. And
// after that first frame, its stage saying its GPU holds its frames back (onHeld) brings its still back till its next frame.

type Turn = { go: () => unknown; prepare?: () => boolean };

const setup = (): { runFreshStage: any; turns: Turn[] } => {
  const turns: Turn[] = [];
  jest
    .spyOn(HTMLCanvasElement.prototype, 'getContext')
    .mockImplementation(((type: string) =>
      type === 'webgl2' ? { getExtension: () => null, getParameter: () => '' } : null) as any);
  let runFreshStage: any;
  jest.isolateModules(() => {
    jest.doMock('../startQueue', () => ({
      waitForTurn: (_box: Element, go: Turn['go'], prepare?: Turn['prepare']) => {
        turns.push({ go, prepare });
        return () => undefined;
      },
    }));
    jest.doMock('../loadFreshEngine', () => ({
      loadFreshEngine: () => Promise.resolve(jest.fn()),
    }));
    ({ runFreshStage } = require('../runFreshStage'));
  });
  return { runFreshStage, turns };
};

const flush = async (): Promise<void> => {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
};

describe('runFreshStage: drawn, and its GPU holding frames back', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    jest.resetModules();
  });

  const run = async (): Promise<{
    turns: Turn[];
    stageRef: { current: any };
    onDrawn: jest.Mock;
    onWaiting: jest.Mock;
    stop: () => void;
    box: HTMLElement;
  }> => {
    const { runFreshStage, turns } = setup();
    const box = document.createElement('div');
    // (in view: jsdom lays nothing out, so its box is given a place on screen)
    box.getBoundingClientRect = () => ({ top: 10, bottom: 100, left: 10, right: 100 } as any);
    document.body.append(box);
    const stageRef = { current: null as any };
    const onDrawn = jest.fn();
    const onWaiting = jest.fn();
    const stop = runFreshStage({
      moduleName: 'Test',
      getBox: () => box,
      stageRef,
      loadComps: () => Promise.resolve({}),
      start: () => true,
      onFail: jest.fn(),
      onRelease: jest.fn(),
      onDrawn,
      onWaiting,
    });
    await flush();
    return { turns, stageRef, onDrawn, onWaiting, stop, box };
  };

  it('calls onDrawn once its first frame is shown, not when it starts', async () => {
    const { turns, stageRef, onDrawn, stop, box } = await run();
    turns[0].go();
    expect(onDrawn).not.toHaveBeenCalled();
    // (its stage: its canvas shows a frame)
    stageRef.current.onShown();
    expect(onDrawn).toHaveBeenCalledTimes(1);
    stageRef.current.onShown();
    expect(onDrawn).toHaveBeenCalledTimes(1);
    stop();
    box.remove();
  });

  it('brings its still back when its stage says its GPU holds its frames back, and takes it away at its next frame', async () => {
    const { turns, stageRef, onWaiting, stop, box } = await run();
    turns[0].go();
    const stage = stageRef.current;
    stage.onShown();
    expect(onWaiting).toHaveBeenLastCalledWith(false);
    // (the stage, its GPU holding frames back past 0.8 s: its canvas hidden, FreshStage.held.web.test.ts)
    stage.onHeld();
    expect(onWaiting).toHaveBeenLastCalledWith(true);
    stage.onShown();
    expect(onWaiting).toHaveBeenLastCalledWith(false);
    stop();
    box.remove();
  });
});

// (a module of its own: its helpers are its own, not shared with the other test files)
export {};
