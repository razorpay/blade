// Import CSS module to ensure it's processed by bundler
import './chip.module.css';

export {
  getChipTemplateClasses,
  getChipWrapperClasses,
  getChipAnimatedClasses,
  getChipTextColorClass,
  getChipTextSizeClass,
  getChipGroupFieldClasses,
  getChipGroupLabelClasses,
  getChipGroupContainerClasses,
  getChipGroupHintClasses,
  chipIconSizes,
} from './chip';
export type { ChipColor, ChipSize } from './chip';
