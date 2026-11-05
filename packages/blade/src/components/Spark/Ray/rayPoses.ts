/**
 * The typing watch's poses: the four watch frames of Figma 45:805 and its "moved back a bit" frame, as the typing engine the
 * dashboard prototype ran (flow 9: typing-v4's WK / WK_C / KANT) drew them, converted into Ray Studio poses.
 *
 * Those frames are page px on a 1920 px page where Ray is 178 px wide, his frame's left edge at x 849 and the box's top (his
 * floor) at y 896, corners as [BL, TL, TR, BR]. Each corner's move from that engine's rest pose becomes a Ray Studio corner
 * offset (Ray px, y up), the floor's move becomes `x`, and the frame's area against his rest area becomes `volume` (the watch
 * frames are drawn at 90-95 % of it).
 */
type Point = [number, number];
type WatchPose = { x: number; corners: Point[]; volume: number };

const PAGE_TO_RAY = 453.5 / 178; // Ray px (his 453.5 px Figma frame) per page px
const FRAME_LEFT = 849;
const FLOOR = 896;
// that engine's rest (Figma frame px, y down, [BL, BR, TR, TL])
const REST: Point[] = [
  [0, 377],
  [404.5, 377],
  [453.5, 0],
  [32.5, 136.5],
];

const area = (q: Point[]): number => {
  let a = 0;
  for (let i = 0; i < 4; i++) {
    const p = q[i];
    const n = q[(i + 1) % 4];
    a += p[0] * n[1] - n[0] * p[1];
  }
  return Math.abs(a) / 2;
};

const fromPage = (corners: Point[]): WatchPose => {
  // [BL, TL, TR, BR] page px -> [BL, BR, TR, TL] Ray px
  const page = [corners[0], corners[3], corners[2], corners[1]];
  const q = page.map(
    ([px, py]): Point => [(px - FRAME_LEFT) * PAGE_TO_RAY, 377 - (FLOOR - py) * PAGE_TO_RAY],
  );
  const moved = q.map((p, i): Point => [p[0] - REST[i][0], p[1] - REST[i][1]]);
  const x = (moved[0][0] + moved[1][0]) / 2;
  return {
    x,
    corners: moved.map(([dx, dy]): Point => [dx - x, -dy]),
    volume: area(q) / area(REST),
  };
};

/** The four watch frames, caret at the far left of the box to the far right. */
const WATCH_POSES: WatchPose[] = [
  fromPage([
    [772, 896],
    [762.1, 805.9],
    [904, 760.1],
    [929.7, 896],
  ]),
  fromPage([
    [835, 896],
    [825.1, 805.9],
    [967, 760.1],
    [992.7, 896],
  ]),
  fromPage([
    [875, 896],
    [875, 803.5],
    [1022.5, 756],
    [1032.7, 896],
  ]),
  fromPage([
    [916, 896],
    [925, 802],
    [1073.7, 751],
    [1073.7, 896],
  ]),
];

/** Where the caret was in each watch frame (page px). The box's whole usable width maps onto this range (followAmt 1). */
const WATCH_CARET = [250, 581, 901, 1021];

/** Figma 45:805 frame 2: on the first keystroke he moves back a bit, then out to the caret. */
const LEAN_BACK = fromPage([
  [861, 896],
  [877.5, 805],
  [1043, 754.5],
  [1025.5, 896],
]);

const mixWatch = (a: WatchPose, b: WatchPose, u: number): WatchPose => ({
  x: a.x + (b.x - a.x) * u,
  corners: a.corners.map(
    (c, i): Point => [c[0] + (b.corners[i][0] - c[0]) * u, c[1] + (b.corners[i][1] - c[1]) * u],
  ),
  volume: a.volume + (b.volume - a.volume) * u,
});

/** The pose for a caret `u` of the way along the box (0 left, 1 right): straight lines between the four frames. */
const watchPoseAt = (u: number): WatchPose => {
  const t = WATCH_CARET[0] + Math.max(0, Math.min(1, u)) * (WATCH_CARET[3] - WATCH_CARET[0]);
  let i = 0;
  while (i < 2 && t > WATCH_CARET[i + 1]) i++;
  return mixWatch(
    WATCH_POSES[i],
    WATCH_POSES[i + 1],
    (t - WATCH_CARET[i]) / (WATCH_CARET[i + 1] - WATCH_CARET[i]),
  );
};

const REST_POSE: WatchPose = {
  x: 0,
  corners: [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ],
  volume: 1,
};

export { WATCH_POSES, LEAN_BACK, REST_POSE, watchPoseAt, mixWatch };
export type { WatchPose, Point };
