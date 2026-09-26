/**
 * A preset's style taxonomy as data: each axis lists every value it accepts.
 * Shipped code never reads it — it exists for the component explorer
 * (`app/v2/docs`), which builds its controls and variant matrices from it.
 * The style-prop interfaces derive from these tuples, so the explorer's
 * options and the prop types cannot drift; exhaustiveness of a preset's
 * class maps is tsc's job (`Record<AxisValue<…>, string>`), not a test's.
 */
export type StyleAxes = Readonly<Record<string, readonly string[]>>;

export type AxisValue<A extends StyleAxes, K extends keyof A> = A[K][number];
