import {
  bindRazorSenseControllerHost,
  createRazorSenseController,
  createRazorSenseSequenceController,
  disposeRazorSenseController,
} from '../RazorSenseController';
import type {
  RazorSenseControllerHostBinding,
  RazorSenseControllerHostCallbacks,
  RazorSenseControllerHostRequest,
} from '../RazorSenseController';
import { RazorSenseError } from '../razorSenseMotionTypes';
import type {
  RazorSenseControllerEvent,
  RazorSenseSequenceDefinition,
} from '../razorSenseMotionTypes';
import { razorSenseLoginToDashboardJourney } from '../razorSenseBuiltInSequences';

type HostFixture = {
  host: RazorSenseControllerHostBinding;
  requests: RazorSenseControllerHostRequest[];
  cancellations: Array<{ request: RazorSenseControllerHostRequest; reason: string }>;
  boundaries: Array<{ request: RazorSenseControllerHostRequest; reason: string }>;
  paused: boolean[];
  getCallbacks(): RazorSenseControllerHostCallbacks;
};

const createHostFixture = (): HostFixture => {
  const requests: RazorSenseControllerHostRequest[] = [];
  const cancellations: HostFixture['cancellations'] = [];
  const boundaries: HostFixture['boundaries'] = [];
  const paused: boolean[] = [];
  let callbacks: RazorSenseControllerHostCallbacks | undefined;
  return {
    host: {
      present: (request, nextCallbacks) => {
        requests.push(request);
        callbacks = nextCallbacks;
      },
      cancel: (request, reason) => cancellations.push({ request, reason }),
      requestBoundary: (request, reason) => boundaries.push({ request, reason }),
      setPaused: (isPaused) => paused.push(isPaused),
    },
    requests,
    cancellations,
    boundaries,
    paused,
    getCallbacks: () => {
      if (!callbacks) throw new Error('Host has not received callbacks.');
      return callbacks;
    },
  };
};

const flushMicrotasks = async (): Promise<void> => {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
};

const last = <Value>(values: readonly Value[]): Value | undefined => values[values.length - 1];

describe('RazorSenseController', () => {
  it('creates a stable SSR-safe initial snapshot and non-thenable commands', () => {
    const controller = createRazorSenseController({ initialState: 'thinking' });

    expect(controller.getSnapshot()).toBe(controller.getSnapshot());
    expect(controller.getSnapshot()).toEqual({
      status: 'idle',
      target: { state: 'thinking' },
      isPaused: false,
      queueLength: 0,
      reducedMotion: false,
      degraded: false,
    });

    const command = controller.transitionTo('working');
    expect('then' in command).toBe(false);
    expect(command.ready).toBeInstanceOf(Promise);
    expect(command.transitioned).toBeInstanceOf(Promise);
    disposeRazorSenseController(controller);
  });

  it('presents an initial branded target without an idle intermediary', () => {
    const controller = createRazorSenseController({ initialTarget: { preset: 'audioWave' } });
    const fixture = createHostFixture();
    bindRazorSenseControllerHost(controller, fixture.host);

    expect(fixture.requests).toHaveLength(1);
    expect(fixture.requests[0]).toMatchObject({
      kind: 'initial',
      target: { preset: 'audioWave' },
      playback: { playback: 'once', endBehavior: 'hold' },
    });
    disposeRazorSenseController(controller);
  });

  it('applies sequence endBehavior to the final renderer occurrence', () => {
    const sequence: RazorSenseSequenceDefinition = {
      id: 'terminal-reset',
      steps: [{ id: 'typing', state: 'typing', playback: 'once' }],
      endBehavior: 'reset-to-start',
    };
    const controller = createRazorSenseSequenceController(sequence);
    const fixture = createHostFixture();
    bindRazorSenseControllerHost(controller, fixture.host, { sequence });

    expect(fixture.requests[0].playback).toEqual({
      playback: 'once',
      endBehavior: 'reset-to-start',
    });
    disposeRazorSenseController(controller);
  });

  it('delivers milestone events before promises and settles each milestone once', async () => {
    const controller = createRazorSenseController();
    const fixture = createHostFixture();
    bindRazorSenseControllerHost(controller, fixture.host);
    const order: string[] = [];
    controller.subscribeEvents((event) => order.push(`event:${event.type}`));

    const command = controller.play({ state: 'thinking' }, { playback: 'once' });
    void command.ready.then(
      () => order.push('promise:ready'),
      () => undefined,
    );
    void command.transitioned.then(
      () => order.push('promise:transitioned'),
      () => undefined,
    );
    void command.completed.then(
      () => order.push('promise:completed'),
      () => undefined,
    );
    const request = last(fixture.requests)!;
    const callbacks = fixture.getCallbacks();

    expect(callbacks.ready(request.token)).toBe(true);
    expect(callbacks.ready(request.token)).toBe(false);
    expect(callbacks.transitionStarted(request.token)).toBe(true);
    expect(callbacks.transitioned(request.token)).toBe(true);
    expect(callbacks.transitioned(request.token)).toBe(false);
    await flushMicrotasks();
    expect(order).toEqual([
      'event:ready',
      'event:transition-start',
      'event:transition-complete',
      'promise:ready',
      'promise:transitioned',
    ]);

    expect(callbacks.terminal(request.token, { iterationCount: 1 })).toBe(true);
    expect(callbacks.terminal(request.token, { iterationCount: 1 })).toBe(false);
    await expect(command.completed).resolves.toMatchObject({
      target: { state: 'thinking' },
      iterationCount: 1,
      reason: 'natural',
    });
    await flushMicrotasks();
    expect(order.slice(-2)).toEqual(['event:playback-complete', 'promise:completed']);
    disposeRazorSenseController(controller);
  });

  it('rejects stale epochs after replacement and starts only the newest command', async () => {
    const controller = createRazorSenseController();
    const fixture = createHostFixture();
    bindRazorSenseControllerHost(controller, fixture.host);
    const first = controller.play({ state: 'thinking' }, { playback: 'loop' });
    const firstRequest = last(fixture.requests)!;

    const second = controller.play({ state: 'working' }, { playback: 'loop' });
    await expect(first.completed).rejects.toMatchObject({ name: 'AbortError' });
    await flushMicrotasks();
    const secondRequest = last(fixture.requests)!;

    expect(secondRequest.target).toEqual({ state: 'working' });
    expect(secondRequest.token.epoch).toBeGreaterThan(firstRequest.token.epoch);
    expect(fixture.getCallbacks().ready(firstRequest.token)).toBe(false);
    expect(fixture.getCallbacks().ready(secondRequest.token)).toBe(true);
    second.cancel();
    disposeRazorSenseController(controller);
  });

  it('coalesces a synchronous replacement burst so only the first and newest targets present', async () => {
    const controller = createRazorSenseController();
    const fixture = createHostFixture();
    bindRazorSenseControllerHost(controller, fixture.host);
    const events: RazorSenseControllerEvent[] = [];
    controller.subscribeEvents((event) => events.push(event));

    const states = [
      'typing',
      'thinking',
      'working',
      'caution',
      'success',
      'idle',
      'working',
      'regret',
    ] as const;
    const commands = states.map((state) => controller.transitionTo(state));
    const supersededReady = commands.slice(0, -1).map((command) =>
      command.ready.then(
        () => 'resolved',
        (error: Error) => error.name,
      ),
    );

    await flushMicrotasks();

    expect(await Promise.all(supersededReady)).toEqual(Array(7).fill('AbortError'));
    expect(fixture.requests.slice(1).map((request) => request.target)).toEqual([
      { state: 'typing' },
      { state: 'regret' },
    ]);
    expect(controller.getSnapshot()).toMatchObject({
      target: { state: 'regret' },
      queueLength: 0,
    });
    expect(events.filter((event) => event.type === 'cancel')).toHaveLength(7);

    commands[commands.length - 1]?.cancel();
    disposeRazorSenseController(controller);
  });

  it('queues work until the active finite playback reaches its terminal', async () => {
    const controller = createRazorSenseController();
    const fixture = createHostFixture();
    bindRazorSenseControllerHost(controller, fixture.host);
    const first = controller.play({ state: 'typing' }, { playback: 'once' });
    const firstRequest = last(fixture.requests)!;
    const second = controller.play(
      { state: 'success' },
      { playback: 'once', interruptionPolicy: 'queue' },
    );

    expect(controller.getSnapshot().queueLength).toBe(1);
    expect(last(fixture.requests)).toBe(firstRequest);
    fixture.getCallbacks().terminal(firstRequest.token, { iterationCount: 1 });
    await expect(first.completed).resolves.toMatchObject({ reason: 'natural' });
    await flushMicrotasks();

    const secondRequest = last(fixture.requests)!;
    expect(secondRequest.target).toEqual({ state: 'success' });
    expect(secondRequest.token.occurrenceId).toBeGreaterThan(firstRequest.token.occurrenceId);
    second.cancel();
    disposeRazorSenseController(controller);
  });

  it('keeps only the newest finish-current request and starts it at the host boundary', async () => {
    const controller = createRazorSenseController();
    const fixture = createHostFixture();
    bindRazorSenseControllerHost(controller, fixture.host);
    const events: Array<{ type: string; reason?: string; commandId?: number }> = [];
    controller.subscribeEvents((event) => events.push(event));
    const active = controller.play({ state: 'thinking' }, { playback: 'loop' });
    const activeRequest = last(fixture.requests)!;
    const superseded = controller.transitionTo('working', {
      interruptionPolicy: 'finish-current',
    });
    const newest = controller.transitionTo('success', {
      interruptionPolicy: 'finish-current',
    });

    await expect(superseded.ready).rejects.toMatchObject({ name: 'AbortError' });
    expect(last(fixture.boundaries)).toMatchObject({
      request: activeRequest,
      reason: 'interrupt',
    });
    fixture.getCallbacks().boundary(activeRequest.token, { iterationCount: 2 });
    await expect(active.completed).resolves.toMatchObject({
      reason: 'interrupted-at-boundary',
      iterationCount: 2,
    });
    await flushMicrotasks();

    expect(last(fixture.requests)?.target).toEqual({ state: 'success' });
    expect(events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'cancel', reason: 'superseded' }),
        expect.objectContaining({
          type: 'playback-complete',
          reason: 'interrupted-at-boundary',
        }),
      ]),
    );
    expect(events).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'cancel',
          reason: 'finish-current',
          commandId: activeRequest.token.commandId,
        }),
      ]),
    );
    newest.cancel();
    disposeRazorSenseController(controller);
  });

  it('treats a cancelled active occurrence as a safe boundary for finish-current', async () => {
    const controller = createRazorSenseController();
    const fixture = createHostFixture();
    bindRazorSenseControllerHost(controller, fixture.host);
    const active = controller.play({ state: 'thinking' }, { playback: 'loop' });
    const pending = controller.transitionTo('working', {
      interruptionPolicy: 'finish-current',
    });

    controller.cancel();
    await expect(active.completed).rejects.toMatchObject({ name: 'AbortError' });
    await flushMicrotasks();

    expect(last(fixture.requests)?.target).toEqual({ state: 'working' });
    pending.cancel();
    disposeRazorSenseController(controller);
  });

  it('waits for an active transition to commit when finish-current reaches a boundary early', async () => {
    const controller = createRazorSenseController();
    const fixture = createHostFixture();
    bindRazorSenseControllerHost(controller, fixture.host);
    const active = controller.transitionTo('success');
    const activeRequest = last(fixture.requests)!;
    const pending = controller.transitionTo('working', {
      interruptionPolicy: 'finish-current',
    });

    fixture.getCallbacks().boundary(activeRequest.token, { iterationCount: 1 });
    await flushMicrotasks();
    expect(last(fixture.requests)).toBe(activeRequest);

    fixture.getCallbacks().transitioned(activeRequest.token);
    await expect(active.transitioned).resolves.toMatchObject({ target: { state: 'success' } });
    await flushMicrotasks();
    expect(last(fixture.requests)?.target).toEqual({ state: 'working' });

    pending.cancel();
    disposeRazorSenseController(controller);
  });

  it('continues queued work when a pending replacement is cancelled before it starts', async () => {
    const controller = createRazorSenseController();
    const fixture = createHostFixture();
    bindRazorSenseControllerHost(controller, fixture.host);
    const active = controller.play({ state: 'thinking' }, { playback: 'loop' });
    const replacement = controller.play({ state: 'working' }, { playback: 'loop' });
    const queued = controller.play(
      { state: 'success' },
      { playback: 'once', interruptionPolicy: 'queue' },
    );

    replacement.cancel();
    await expect(active.completed).rejects.toMatchObject({ name: 'AbortError' });
    await expect(replacement.completed).rejects.toMatchObject({ name: 'AbortError' });
    await flushMicrotasks();

    expect(last(fixture.requests)?.target).toEqual({ state: 'success' });
    expect(controller.getSnapshot().queueLength).toBe(0);
    queued.cancel();
    disposeRazorSenseController(controller);
  });

  it('supports manual sequence advance with distinct occurrences for equal targets', async () => {
    const sequence: RazorSenseSequenceDefinition = {
      id: 'same-target-steps',
      steps: [
        { id: 'first', state: 'typing', playback: 'once', advance: 'manual' },
        { id: 'second', state: 'typing', playback: 'once' },
      ],
    };
    const controller = createRazorSenseSequenceController(sequence);
    const fixture = createHostFixture();
    const bound = bindRazorSenseControllerHost(controller, fixture.host, { sequence });
    const firstRequest = last(fixture.requests)!;

    fixture.getCallbacks().terminal(firstRequest.token, { iterationCount: 1 });
    await flushMicrotasks();
    expect(last(fixture.requests)).toBe(firstRequest);
    expect(controller.getSnapshot().status).toBe('holding');
    expect(controller.advance()).toBe(true);
    expect(controller.advance()).toBe(false);
    fixture.getCallbacks().boundary(firstRequest.token, { iterationCount: 1 });
    await flushMicrotasks();

    const secondRequest = last(fixture.requests)!;
    expect(secondRequest.target).toEqual(firstRequest.target);
    expect(secondRequest.token.commandId).toBe(firstRequest.token.commandId);
    expect(secondRequest.token.epoch).toBe(firstRequest.token.epoch);
    expect(secondRequest.token.occurrenceId).not.toBe(firstRequest.token.occurrenceId);
    bound.unbind();
    disposeRazorSenseController(controller);
  });

  it('finishes a sequence command at the active boundary without starting remaining steps', async () => {
    const controller = createRazorSenseController();
    const fixture = createHostFixture();
    bindRazorSenseControllerHost(controller, fixture.host);
    const command = controller.playSequence({
      id: 'finish-sequence-at-boundary',
      steps: [
        { id: 'first', state: 'thinking', playback: 'once' },
        { id: 'second', state: 'working', playback: 'once' },
      ],
    });
    const firstRequest = last(fixture.requests)!;

    const completed = command.finishAtBoundary();
    expect(last(fixture.boundaries)).toMatchObject({
      request: firstRequest,
      reason: 'finish-command',
    });
    fixture.getCallbacks().boundary(firstRequest.token, { iterationCount: 1 });

    await expect(completed).resolves.toMatchObject({
      sequenceId: 'finish-sequence-at-boundary',
      stepId: 'first',
      reason: 'finished-by-controller',
    });
    await flushMicrotasks();
    expect(fixture.requests.filter((request) => request.kind === 'sequence-step')).toHaveLength(1);
    disposeRazorSenseController(controller);
  });

  it('preserves private built-in choreography metadata on host requests', () => {
    const controller = createRazorSenseSequenceController(razorSenseLoginToDashboardJourney);
    const fixture = createHostFixture();
    bindRazorSenseControllerHost(controller, fixture.host, {
      sequence: razorSenseLoginToDashboardJourney,
    });

    expect(last(fixture.requests)?.builtInManifest).toMatchObject({
      kind: 'login-to-dashboard',
      sourceFramesPerSecond: 24,
    });
    disposeRazorSenseController(controller);
  });

  it('correlates active sequence errors and cancellation with the run context', async () => {
    const sequence: RazorSenseSequenceDefinition = {
      id: 'correlated-sequence-events',
      steps: [{ id: 'active-step', state: 'thinking', playback: 'once' }],
    };
    const controller = createRazorSenseSequenceController(sequence);
    const fixture = createHostFixture();
    const events: RazorSenseControllerEvent[] = [];
    controller.subscribeEvents((event) => events.push(event));
    bindRazorSenseControllerHost(controller, fixture.host, {
      sequence,
      runId: 'request-42',
    });
    const request = last(fixture.requests)!;
    const callbacks = fixture.getCallbacks();

    callbacks.setFlags(request.token, { reducedMotion: true, degraded: true });
    callbacks.error(request.token, new Error('recoverable'), { recoverable: true });
    controller.cancel();
    await flushMicrotasks();

    expect(events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'error',
          sequenceId: sequence.id,
          runId: 'request-42',
          stepId: 'active-step',
          target: { state: 'thinking' },
        }),
        expect.objectContaining({
          type: 'cancel',
          status: 'active',
          sequenceId: sequence.id,
          runId: 'request-42',
          stepId: 'active-step',
          target: { state: 'thinking' },
          reducedMotion: true,
          degraded: true,
        }),
      ]),
    );
    disposeRazorSenseController(controller);
  });

  it('guards sequence definitions, one-host ownership, pause, and AbortSignal', async () => {
    const sequence: RazorSenseSequenceDefinition = {
      id: 'guarded',
      steps: [{ id: 'one', state: 'loading', playback: 'once' }],
    };
    const controller = createRazorSenseSequenceController(sequence);
    const fixture = createHostFixture();
    bindRazorSenseControllerHost(controller, fixture.host, { sequence });

    expect(() =>
      bindRazorSenseControllerHost(controller, createHostFixture().host, { sequence }),
    ).toThrow(RazorSenseError);
    controller.pause();
    controller.resume();
    expect(fixture.paused).toEqual([false, true, false]);
    disposeRazorSenseController(controller);

    const mismatchedController = createRazorSenseSequenceController(sequence);
    expect(() =>
      bindRazorSenseControllerHost(mismatchedController, createHostFixture().host, {
        sequence: {
          id: 'guarded',
          steps: [{ id: 'changed', state: 'loading', playback: 'once' }],
        },
      }),
    ).toThrow(expect.objectContaining({ code: 'sequence-controller-mismatch' }));
    disposeRazorSenseController(mismatchedController);

    const standalone = createRazorSenseController();
    const abortController = new AbortController();
    abortController.abort('not needed');
    const aborted = standalone.play(
      { state: 'thinking' },
      { playback: 'loop', signal: abortController.signal },
    );
    await expect(aborted.ready).rejects.toMatchObject({ name: 'AbortError' });
    expect(standalone.getSnapshot().target).toEqual({ state: 'idle' });
    disposeRazorSenseController(standalone);
  });
});
