import type { FreshDoc, FreshPlayer } from '../RazorSenseEngine';
import { TypingStrength } from '../RazorSenseEngine/typingStrength';
import type { TypingTune } from '../RazorSenseEngine/typingStrength';

/**
 * The chat background's typing surge, as flow 9 plays it on its landing (rz62 landTick): a strength between 0 (idle, drifting) and
 * 1 (the typing surge, `TypingStrength`), shown as an exact cross-fade (the typing surge comp over idle at that opacity). While it
 * is up the shapes grow (`grow`) round the typing's centre. The timeline runs forward and back (its keys ease to a stop at both
 * ends).
 */
type TypingSurgeTune = Required<TypingTune>;

type TypingSurgeSetup = { tune: TypingSurgeTune; centre: [number, number] };

const getTypingSurgeSetup = (doc: FreshDoc): TypingSurgeSetup | null => {
  const r = doc.ui?.freshChatBackground as TypingSurgeSetup | undefined;
  return r?.tune ? r : null;
};

class TypingSurge {
  private readonly tune: TypingSurgeTune;
  private readonly centre: [number, number];
  private readonly strength = new TypingStrength();
  private clk = 0;
  private alive = 0;
  private path = 0;
  /** the strip stretched to its chat input (x, y) round the input's middle (comp px from the comp's middle) */
  private stretch = { kx: 1, ky: 1, cx: 0, cy: 0 };

  constructor(setup: TypingSurgeSetup) {
    this.tune = setup.tune;
    this.centre = setup.centre;
  }

  /** the strip stretched kx across and ky down round (cx, cy) (comp px from the comp's middle); the bands keep their size */
  public setStretch(kx: number, ky: number, cx: number, cy: number): void {
    this.stretch = { kx, ky, cx, cy };
  }

  /**
   * The shapes: grown by g round the typing's centre (flow 9's landTick), then stretched round the chat input's middle. One
   * scale and one shift do both exactly; unstretched, it's flow 9's own call.
   */
  public pose(player: FreshPlayer, g: number): void {
    const { kx, ky, cx, cy } = this.stretch;
    const [gx, gy] = this.centre;
    if (kx === 1 && ky === 1) {
      player.shapes(g, g, gx, gy, 1);
      player.offset(0, 0);
      return;
    }
    player.shapes(kx * g, ky * g, 0, 0, 1);
    player.offset(kx * (1 - g) * gx + (1 - kx) * cx, ky * (1 - g) * gy + (1 - ky) * cy);
  }

  /** the typing surge's strength (0-1) */
  public get a(): number {
    return this.strength.a;
  }

  /** a key typed (s: now, in seconds) */
  public hit(s: number): void {
    this.strength.hit(s, this.tune);
  }

  /** moves everything on by dt (s) and draws that moment */
  public step(player: FreshPlayer, dt: number, s: number, duration: number): void {
    const T = this.tune;
    this.strength.step(dt, s, T);
    const go = this.strength.clocks(dt, T);
    this.clk += go.alive;
    this.alive += go.alive;
    this.path += go.path;
    const g = this.strength.grow(T);

    const u = this.clk % (2 * duration);
    const t = u <= duration ? u : 2 * duration - u;
    player.comp('ty', { op: this.a > 0.002 ? this.a : 0 });
    player.pathTime(this.path);
    this.pose(player, g);
    player.seek(t, this.alive);
  }
}

export { TypingSurge, getTypingSurgeSetup };
export type { TypingSurgeTune, TypingSurgeSetup };
