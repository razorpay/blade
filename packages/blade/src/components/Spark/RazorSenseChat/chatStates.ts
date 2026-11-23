import type { ChatAnchors, ChatDriver } from './chatDriver';
import type { Outcome, spliceOutcome } from './outcome';
import type { VoiceBottom } from './voiceBottom';
import type { FreshDoc, FreshEngine, FreshExport } from '../RazorSenseEngine';
import { releaseVoice, tapVoice } from '../RazorSenseEngine/voice';
import type { VoiceTap } from '../RazorSenseEngine/voice';

/**
 * The PR's states on the chat's strip (RazorSenseChat, and RazorSenseBottomWave on its own), on the chat's one engine: each is a
 * document composed on the chat's own (an outcome spliced on after the strip's end, the voice look's row in the strip page's Comp 3)
 * and loaded on the same engine (load: its GPU context and compiled programs kept), the swap made where it's the same picture. One at
 * a time: offline wins over the voice look (it goes at once), the voice look and an outcome wait for the strip to be at rest (thinking
 * done), and an outcome waits for the voice look to be down. Each state's chunk is loaded when it's first wanted: the voice look when
 * the page first listens, an outcome while the page is idle once the chat starts thinking.
 */

type ChatStateInputs = {
  isOffline: boolean;
  isListening: boolean;
  voiceStream?: MediaStream;
  outcome?: Outcome;
};

/** the strip's blur reaches this far above the chat bar (CSS px at scale 1): it drops till that's below the edge */
const STRIP_REACH = 170;
/** it drops at least this far (CSS px) */
const DROP_MIN = 160;
/** with reduced motion an outcome shows this moment of its piece for its length (s): its colour, its splash grown */
const OUTCOME_STILL_AT = 1.6;
/** the strip pages' Comp 3 */
const STRIP_COMPS = ['c3', 'b_c3'] as const;
/** the chat comp's chat bar middle across, comp px from the comp's middle (chatDriver's COMP.box: 787 of 1512, at 2x) */
const BAR_X = (787 - 1512 / 2) * 2;

const whenIdle = (go: () => void): void => {
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
  };
  if (w.requestIdleCallback) w.requestIdleCallback(go, { timeout: 2000 });
  else window.setTimeout(go, 200);
};

class ChatStates {
  public inputs: ChatStateInputs = { isOffline: false, isListening: false };
  private outcomeModule: { spliceOutcome: typeof spliceOutcome } | null = null;
  private isLoadingOutcome = false;
  private isLoadingVoice = false;
  /** the outcome spliced into the loaded document (and where its piece is on the strip's clock) */
  private splice: { outcome: Outcome; doc: FreshDoc; t0: number; t1: number } | null = null;
  /** the voice look, made the first time the page listens, and the Comp 3 its row is in while it's loaded */
  private voice: VoiceBottom | null = null;
  private voiceComp: string | null = null;
  /** the outcome last played (one plays once each time it's set) */
  private played: Outcome | undefined;
  private tap: VoiceTap | null = null;
  private tapStream: MediaStream | null = null;
  private isDead = false;
  private stillTimer = 0;

  private readonly engine: FreshEngine;
  private readonly base: FreshDoc;
  private readonly opts: FreshExport['opts'];
  private readonly mode: 'light' | 'dark';
  private readonly scale: number;
  /** reduced motion: draws a settled frame of where it is now */
  private readonly redraw?: () => void;

  constructor(
    engine: FreshEngine,
    base: FreshDoc,
    opts: FreshExport['opts'],
    mode: 'light' | 'dark',
    scale: number,
    redraw?: () => void,
  ) {
    this.engine = engine;
    this.base = base;
    this.opts = opts;
    this.mode = mode;
    this.scale = scale;
    this.redraw = redraw;
  }

  /** the chat started thinking: its outcomes' chunk is fetched while the page is idle, so one is ready by the answer */
  public prefetchOutcome(): void {
    if (this.outcomeModule || this.isLoadingOutcome) return;
    this.isLoadingOutcome = true;
    whenIdle(() => {
      import('./outcome')
        .then((m) => {
          this.outcomeModule = m;
          // (reduced motion: drawn as it is now that it's here)
          if (!this.isDead) this.redraw?.();
        })
        .catch(() => undefined)
        .finally(() => {
          this.isLoadingOutcome = false;
        });
    });
  }

  /**
   * Each frame, before the driver steps: offline's drop, an outcome starting once the strip is at rest, the voice look's morph and
   * its document swapped in and out at rest (now: performance.now())
   */
  public frame(dt: number, now: number, driver: ChatDriver, anchors: ChatAnchors): void {
    if (this.isDead) return;
    const { isOffline, isListening, outcome } = this.inputs;
    driver.setDrop(isOffline ? this.dropBy(anchors) : 0, now);
    // an outcome: once each time it's set, once the strip is at rest (and the voice look down); cleared mid-way, it plays back
    if (outcome !== this.played) {
      if (!outcome) {
        driver.clearOutcome();
        this.played = undefined;
      } else if (!this.outcomeModule) {
        this.prefetchOutcome();
      } else if (driver.isAtRest() && !isOffline && !this.voiceComp) {
        this.played = outcome;
        this.startOutcome(driver, outcome);
      }
    }
    this.frameVoice(dt, now, driver, anchors, isListening && !isOffline);
  }

  /** reduced motion: where it is now, settled (offline dropped, the voice look up and silent, an outcome's moment), then drawn */
  public settle(driver: ChatDriver, anchors: ChatAnchors): void {
    if (this.isDead) return;
    const now = performance.now();
    const { isOffline, isListening, outcome } = this.inputs;
    driver.setDrop(isOffline ? this.dropBy(anchors) : 0, now, true);
    if (outcome !== this.played) {
      this.played = outcome;
      window.clearTimeout(this.stillTimer);
      if (outcome && this.outcomeModule && driver.isAtRest() && !isOffline) {
        this.startOutcome(driver, outcome);
        driver.holdOutcome(OUTCOME_STILL_AT);
        // (its moment for the piece's length, then the strip at rest)
        this.stillTimer = window.setTimeout(() => {
          driver.endOutcome();
          this.redraw?.();
        }, (this.splice ? this.splice.t1 - this.splice.t0 : 3.7) * 1000);
      } else if (outcome && !this.outcomeModule) {
        this.played = undefined;
        this.prefetchOutcome();
      } else {
        driver.endOutcome();
      }
    }
    const want = isListening && !isOffline && driver.isAtRest();
    if (want && this.voice && !this.voiceComp) this.loadVoice(driver, anchors);
    if (want && !this.voice) this.importVoice();
    if (this.voice && this.voiceComp) {
      if (want) {
        this.voice.motion.u = 1;
        this.voice.frame(0, now / 1000, true, 0, null);
      } else {
        this.unloadVoice();
      }
    }
  }

  public destroy(): void {
    this.isDead = true;
    window.clearTimeout(this.stillTimer);
    this.releaseTap();
  }

  /** how far the strip drops offline: below the edge it leaves at (CSS px) */
  private dropBy(anchors: ChatAnchors): number {
    const bar = anchors.bar;
    if (!bar || anchors.leaveAt === undefined) return DROP_MIN * 4;
    return Math.max(DROP_MIN, anchors.leaveAt - (bar.top - STRIP_REACH * this.scale));
  }

  private startOutcome(driver: ChatDriver, outcome: Outcome): void {
    const M = this.outcomeModule;
    if (!M) return;
    if (this.splice?.outcome !== outcome) {
      const { doc, t0, t1 } = M.spliceOutcome(this.base, outcome, this.mode, STRIP_COMPS);
      this.splice = { outcome, doc, t0, t1 };
    }
    this.load(this.splice.doc);
    driver.playOutcome(this.splice.t0, this.splice.t1 - this.splice.t0);
  }

  private frameVoice(
    dt: number,
    now: number,
    driver: ChatDriver,
    anchors: ChatAnchors,
    isWanted: boolean,
  ): void {
    const restComp = driver.restComp();
    const want = isWanted && driver.isAtRest();
    if (want && !this.voice) this.importVoice();
    const { voice } = this;
    if (!voice) return;
    // (a send, the thinking, offline, another strip page: straight back to the strip, at once)
    if (
      this.voiceComp &&
      (!restComp || restComp !== this.voiceComp || (!isWanted && this.inputs.isOffline))
    ) {
      voice.motion.reset();
      this.unloadVoice();
      return;
    }
    if (want && !this.voiceComp) this.loadVoice(driver, anchors);
    if (!this.voiceComp) return;
    // (the voice is read only while listening: on the way out the row falls in silence, as speechtest 2 and flow 10.5 have it)
    const level = want ? this.readVoice(now) : null;
    voice.frame(dt, now / 1000, want, level ? level.lvl : 0, level ? level.bands : null);
    // back at rest: the strip's own document again (the same picture)
    if (!want && voice.motion.u <= 0) this.unloadVoice();
  }

  private importVoice(): void {
    if (this.voice || this.isLoadingVoice) return;
    this.isLoadingVoice = true;
    import('./voiceBottom')
      .then((m) => {
        if (this.isDead) return;
        this.voice = new m.VoiceBottom(this.mode, this.engine.player.tools);
        // (reduced motion: drawn as it is now that it's here)
        this.redraw?.();
      })
      .catch(() => undefined)
      .finally(() => {
        this.isLoadingVoice = false;
      });
  }

  private loadVoice(driver: ChatDriver, anchors: ChatAnchors): void {
    const comp = driver.restComp();
    const { voice } = this;
    if (!voice || !comp) return;
    // the row as wide as the chat input (comp px: the chat comp is drawn at 0.5 x scale), on the strip's top edge where flow has it:
    // anchored to the strip at the bottom, coming out from under the chat input; a taller chat input doesn't move it
    const k = 0.5 * this.scale;
    const width = (anchors.bar?.width ?? 840) / k;
    const doc = voice.compose(this.splice?.doc ?? this.base, comp, BAR_X, width);
    voice.motion.reset();
    this.voiceComp = comp;
    this.load(doc);
    this.engine.player.look(voice.look);
  }

  private unloadVoice(): void {
    if (!this.voiceComp) return;
    this.voiceComp = null;
    this.engine.player.look(null);
    this.load(this.splice?.doc ?? this.base);
    this.releaseTap();
  }

  private load(doc: FreshDoc): void {
    this.engine.load?.({ doc, opts: this.opts });
  }

  /** the page's voice this frame (one analyser read, shared): null with no stream */
  private readVoice(now: number): VoiceTap['level'] | null {
    const stream = this.inputs.voiceStream ?? null;
    if (stream !== this.tapStream) {
      this.releaseTap();
      if (stream) {
        this.tap = tapVoice(stream);
        this.tapStream = stream;
      }
    }
    return this.tap ? this.tap.read(now) : null;
  }

  private releaseTap(): void {
    if (this.tap && this.tapStream) releaseVoice(this.tapStream, this.tap);
    this.tap = null;
    this.tapStream = null;
  }
}

export { ChatStates };
export type { ChatStateInputs };
