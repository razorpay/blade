/**
 * Slider component for selecting a numeric value within a range.
 *
 * @example
 * // Uncontrolled
 * <Slider label="Volume" min={0} max={100} defaultValue={40} />
 *
 * // Controlled
 * const [vol, setVol] = React.useState(40);
 * <Slider label="Volume" value={vol} onChange={({ value }) => setVol(value)} />
 */
export { Slider } from './Slider.web';
export type { SliderProps } from './types';
