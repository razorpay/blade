import {
  getFillWidthExpression,
  getMarkerValues,
  getMinTrackWidth,
  getOffsetExpression,
  getSpacedScaleValues,
  getValueRatio,
  getVisibility,
  snapValue,
} from '../utils';

describe('SliderInput utils', () => {
  describe('snapValue', () => {
    it('should snap to the nearest step', () => {
      const range = { min: 0, max: 100, step: 25 };
      expect(snapValue(0, range)).toBe(0);
      expect(snapValue(37, range)).toBe(25);
      expect(snapValue(38, range)).toBe(50);
      expect(snapValue(100, range)).toBe(100);
    });

    it('should clamp values outside the range', () => {
      const range = { min: 10, max: 20, step: 1 };
      expect(snapValue(-50, range)).toBe(10);
      expect(snapValue(500, range)).toBe(20);
    });

    it('should keep max reachable when the range is not a whole number of steps', () => {
      // 0-100 by 30 stops at 90, so max is 10 away while the step is 30.
      const range = { min: 0, max: 100, step: 30 };
      expect(snapValue(100, range)).toBe(100);
      expect(snapValue(96, range)).toBe(100);
      // Still closer to the last real step than to max.
      expect(snapValue(91, range)).toBe(90);
    });

    it('should not leak floating point drift into the value', () => {
      const range = { min: 0, max: 1, step: 0.1 };
      expect(snapValue(0.3, range)).toBe(0.3);
      expect(snapValue(0.7000000001, range)).toBe(0.7);
    });

    it('should fall back to min for a non-finite value', () => {
      expect(snapValue(NaN, { min: 5, max: 10, step: 1 })).toBe(5);
    });
  });

  describe('getMarkerValues', () => {
    it('should produce one marker per step', () => {
      expect(getMarkerValues({ min: 0, max: 100, step: 25 })).toEqual([0, 25, 50, 75, 100]);
    });

    it('should append max when it is not itself a step', () => {
      expect(getMarkerValues({ min: 0, max: 100, step: 30 })).toEqual([0, 30, 60, 90, 100]);
    });

    it('should not drift on fractional steps', () => {
      expect(getMarkerValues({ min: 0, max: 0.5, step: 0.1 })).toEqual([
        0,
        0.1,
        0.2,
        0.3,
        0.4,
        0.5,
      ]);
    });
  });

  describe('positioning', () => {
    it('should inset the ends by the marker radius so end dots sit on the rail', () => {
      expect(getOffsetExpression(0)).toBe('calc(1.5px + 0 * (100% - 3px))');
      expect(getOffsetExpression(1)).toBe('calc(1.5px + 1 * (100% - 3px))');
    });

    it('should end the fill at the far edge of the reached marker, not its centre', () => {
      // At max this resolves to 3px + (100% - 3px), which is exactly the full track.
      expect(getFillWidthExpression(1)).toBe('calc(3px + 1 * (100% - 3px))');
      // At min the fill is exactly one dot wide, so the first marker reads as filled.
      expect(getFillWidthExpression(0)).toBe('calc(3px + 0 * (100% - 3px))');
    });

    it('should map value to ratio and clamp out of range values', () => {
      expect(getValueRatio(50, { min: 0, max: 100 })).toBe(0.5);
      expect(getValueRatio(-10, { min: 0, max: 100 })).toBe(0);
      expect(getValueRatio(0, { min: 5, max: 5 })).toBe(0);
    });
  });

  describe('suppression', () => {
    it('should show everything while the track is unmeasured', () => {
      expect(getVisibility({ trackWidth: 0, markerCount: 50, widestLabelWidth: 20 })).toEqual({
        canShowMarkers: true,
        canShowScale: true,
      });
    });

    it('should drop markers once the rings would collide', () => {
      // 11 markers over 300px is a 29.7px pitch, comfortably above the 10px floor.
      expect(
        getVisibility({ trackWidth: 300, markerCount: 11, widestLabelWidth: 0 }).canShowMarkers,
      ).toBe(true);
      // 101 markers over the same track is a 2.97px pitch.
      expect(
        getVisibility({ trackWidth: 300, markerCount: 101, widestLabelWidth: 0 }).canShowMarkers,
      ).toBe(false);
    });

    it('should drop the scale before the markers, since labels are wider than rings', () => {
      // 21 markers over 300px is a 14.85px pitch: clear of the 10px ring floor, but not
      // enough for a 17px label plus its 4px gap.
      const { canShowMarkers, canShowScale } = getVisibility({
        trackWidth: 300,
        markerCount: 21,
        widestLabelWidth: 17,
      });
      expect(canShowMarkers).toBe(true);
      expect(canShowScale).toBe(false);
    });
  });

  describe('getSpacedScaleValues', () => {
    const range = { min: 0, max: 100, step: 33.33 };
    // "33.33" is the widest label at 5 characters.
    const widestLabelWidth = 28;

    it('should drop a label that collides with max rather than dropping max', () => {
      // A step of 33.33 leaves a 0.01 sliver between the last whole step and max, so their
      // labels print on top of each other however wide the track is.
      const values = getMarkerValues(range);
      expect(values).toEqual([0, 33.33, 66.66, 99.99, 100]);

      expect(getSpacedScaleValues({ values, trackWidth: 400, widestLabelWidth, range })).toEqual([
        0,
        33.33,
        66.66,
        100,
      ]);
    });

    it('should keep a trailing step that is genuinely far enough from max', () => {
      // The UnevenSteps story: 90 sits a tenth of the range from 100, which is legible.
      const evenishRange = { min: 0, max: 100, step: 30 };
      const values = getMarkerValues(evenishRange);
      expect(values).toEqual([0, 30, 60, 90, 100]);

      expect(
        getSpacedScaleValues({
          values,
          trackWidth: 400,
          widestLabelWidth: 17,
          range: evenishRange,
        }),
      ).toEqual(values);
    });

    it('should show everything while the track is unmeasured', () => {
      const values = getMarkerValues(range);
      expect(getSpacedScaleValues({ values, trackWidth: 0, widestLabelWidth, range })).toEqual(
        values,
      );
    });

    it('should always keep both bounds, however cramped the track', () => {
      const values = getMarkerValues({ min: 0, max: 100, step: 10 });
      expect(
        getSpacedScaleValues({ values, trackWidth: 60, widestLabelWidth: 40, range }),
      ).toEqual([0, 100]);
    });
  });

  describe('getMinTrackWidth', () => {
    it('should widen the floor when labels are wider than the marker ring', () => {
      expect(getMinTrackWidth(5, 0)).toBeLessThan(getMinTrackWidth(5, 30));
    });

    it('should collapse to a single dot when there is nothing to space out', () => {
      expect(getMinTrackWidth(1, 50)).toBe(3);
    });
  });
});
