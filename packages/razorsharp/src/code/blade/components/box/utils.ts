import type { AXIS_ALIGNMENT } from './constants';
import { AXIS_ALIGNMENT_TO_FLEX_MAP } from './constants';

export const getFlexAlignmentFromAxisAlignment = (
  figmaLayoutAlignment: keyof typeof AXIS_ALIGNMENT,
): string => {
  return AXIS_ALIGNMENT_TO_FLEX_MAP[figmaLayoutAlignment];
};
