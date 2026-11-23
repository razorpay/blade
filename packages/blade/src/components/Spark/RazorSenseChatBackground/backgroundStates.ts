import { withRoom } from '../RazorSenseEngine';
import type { FreshDoc, FreshEngine, FreshExport } from '../RazorSenseEngine';
import { OfflineFade } from '../RazorSenseEngine/offline';
import { releaseVoice, tapVoice } from '../RazorSenseEngine/voice';
import type { VoiceTap } from '../RazorSenseEngine/voice';
import type { VoiceDashboard } from './voiceDashboard';

/** the states the page sets on the chat background */
type BackgroundInputs = { isOffline: boolean; isListening: boolean; voiceStream?: MediaStream };

/**
 * The PR's states on the chat background, on its one engine: offline fades every shape away under the Colorama (the engine's fade();
 * flow 10.5's mal9.js: 1 s each way, easing in going and out coming back, turned round from where it is); listening swaps in the voice
 * dashboard (its own chunk, loaded the first time it listens) at m 0, where it's the same picture, and morphs into it, and back out
 * and swapped back at m 0. Offline wins: the voice look goes at once.
 */
class BackgroundStates {
  private readonly fade = new OfflineFade();
  private voice: VoiceDashboard | null = null;
  private isLoadingVoice = false;
  private isVoiceDoc = false;
  private tap: VoiceTap | null = null;
  private tapStream: MediaStream | null = null;
  private isDead = false;

  private readonly engine: FreshEngine;
  private readonly base: FreshDoc;
  private readonly opts: FreshExport['opts'];
  private readonly mode: 'light' | 'dark';
  /** the room the chat background's comps are given (withRoom): the voice dashboard's the same */
  private readonly room: { x: number; y: number };
  /** another document is on the engine: lay it out again */
  private readonly onLoad: () => void;

  constructor(
    engine: FreshEngine,
    base: FreshDoc,
    opts: FreshExport['opts'],
    mode: 'light' | 'dark',
    room: { x: number; y: number },
    onLoad: () => void,
  ) {
    this.engine = engine;
    this.base = base;
    this.opts = opts;
    this.mode = mode;
    this.room = room;
    this.onLoad = onLoad;
  }

  public frame(dt: number, nowMs: number, inputs: BackgroundInputs): void {
    if (this.isDead) return;
    this.engine.player.fade(this.fade.step(dt, inputs.isOffline));
    const want = inputs.isListening && !inputs.isOffline;
    if (want && !this.voice) this.importVoice();
    const { voice } = this;
    if (!voice) return;
    if (inputs.isOffline && this.isVoiceDoc) {
      // (offline: the voice look goes at once)
      voice.motion.reset();
      this.toBase();
      return;
    }
    if (want && !this.isVoiceDoc) this.toVoice();
    if (!this.isVoiceDoc) return;
    const level = this.readVoice(nowMs, inputs.voiceStream);
    voice.frame(dt, nowMs / 1000, want, level ? level.lvl : 0, level ? level.bands : null);
    if (!want && voice.motion.u <= 0) this.toBase();
  }

  /** reduced motion: offline gone, listening the voice look (silent), at once */
  public settle(inputs: BackgroundInputs, redraw: () => void): void {
    if (this.isDead) return;
    this.fade.set(inputs.isOffline ? 0 : 1);
    this.engine.player.fade(this.fade.k);
    const want = inputs.isListening && !inputs.isOffline;
    if (want && !this.voice) this.importVoice(redraw);
    if (!this.voice) return;
    if (want) {
      if (!this.isVoiceDoc) this.toVoice();
      this.voice.motion.u = 1;
      this.voice.frame(0, performance.now() / 1000, true, 0, null);
    } else if (this.isVoiceDoc) {
      this.toBase();
    }
  }

  /** offline, faded all the way */
  public isAway(): boolean {
    return this.fade.isGone();
  }

  public destroy(): void {
    this.isDead = true;
    this.releaseTap();
  }

  private importVoice(redraw?: () => void): void {
    if (this.isLoadingVoice) return;
    this.isLoadingVoice = true;
    import('./voiceDashboard')
      .then((m) => {
        if (this.isDead) return;
        this.voice = new m.VoiceDashboard(this.mode, this.base, this.engine.player.tools);
        redraw?.();
      })
      .catch(() => undefined)
      .finally(() => {
        this.isLoadingVoice = false;
      });
  }

  private toVoice(): void {
    const { voice } = this;
    if (!voice) return;
    voice.motion.reset();
    this.isVoiceDoc = true;
    this.engine.load?.({ doc: withRoom(voice.doc, this.room), opts: this.opts });
    this.engine.player.look(voice.look);
    this.onLoad();
  }

  private toBase(): void {
    this.isVoiceDoc = false;
    this.engine.player.look(null);
    this.engine.load?.({ doc: this.base, opts: this.opts });
    this.engine.player.comp('ty', { op: 0 });
    this.onLoad();
    this.releaseTap();
  }

  /** the page's voice this frame (one analyser read, shared): null with no stream */
  private readVoice(nowMs: number, stream?: MediaStream): VoiceTap['level'] | null {
    if ((stream ?? null) !== this.tapStream) {
      this.releaseTap();
      if (stream) {
        this.tap = tapVoice(stream);
        this.tapStream = stream;
      }
    }
    return this.tap ? this.tap.read(nowMs) : null;
  }

  private releaseTap(): void {
    if (this.tap && this.tapStream) releaseVoice(this.tapStream, this.tap);
    this.tap = null;
    this.tapStream = null;
  }
}

export { BackgroundStates };
export type { BackgroundInputs };
