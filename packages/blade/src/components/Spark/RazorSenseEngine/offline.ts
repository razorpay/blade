/**
 * Offline on a landing (flow 10.5's mal9.js): every shape fades away under the Colorama, k from 1 to 0 over 1 s easing in (k = 1 - u²),
 * and back over 1 s easing out (k = 1 - (1 - u)²). Turned round mid-way, it starts from the k it's at.
 */
const FADE_SECONDS = 1;

class OfflineFade {
  /** every shape's opacity x k */
  public k = 1;
  private u = 1;
  private isGoing = false;

  /** k after dt s more of going away (offline) or coming back */
  public step(dt: number, isOffline: boolean): number {
    if (isOffline !== this.isGoing) {
      // (turned round: from the k it's at, on the other way's curve)
      this.isGoing = isOffline;
      this.u = isOffline ? Math.sqrt(1 - this.k) : 1 - Math.sqrt(1 - this.k);
    }
    if ((isOffline && this.k <= 0) || (!isOffline && this.k >= 1)) return this.k;
    this.u = Math.min(1, this.u + dt / FADE_SECONDS);
    this.k = isOffline ? 1 - this.u * this.u : 1 - (1 - this.u) * (1 - this.u);
    return this.k;
  }

  /** there at once (reduced motion) */
  public set(k: number): void {
    this.k = k;
    this.isGoing = k < 1;
    this.u = 1;
  }

  /** gone all the way */
  public isGone(): boolean {
    return this.isGoing && this.k <= 0;
  }
}

export { OfflineFade };
