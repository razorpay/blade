import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _PaperclipIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.9012 3.87933C16.7287 2.70689 14.8278 2.70689 13.6554 3.87933L4.46538 13.0693C2.51146 15.0233 2.51146 18.1912 4.46538 20.1451C6.41931 22.099 9.58724 22.099 11.5412 20.1451L20.7312 10.9551C21.1217 10.5646 21.7549 10.5646 22.1454 10.9551C22.5359 11.3456 22.5359 11.9788 22.1454 12.3693L12.9554 21.5593C10.2204 24.2943 5.78614 24.2943 3.05117 21.5593C0.316196 18.8244 0.316196 14.3901 3.05117 11.6551L12.2412 2.46512C14.1947 0.511628 17.3619 0.511627 19.3154 2.46512C21.2689 4.41861 21.2689 7.58584 19.3154 9.53933L10.1154 18.7293C8.94338 19.9013 7.04318 19.9013 5.87117 18.7293C4.69916 17.5573 4.69916 15.6571 5.87117 14.4851L14.3616 6.0047C14.7523 5.61441 15.3855 5.61478 15.7758 6.00553C16.1661 6.39629 16.1657 7.02945 15.775 7.41975L7.28538 15.8993C6.89484 16.2903 6.89456 16.9243 7.28538 17.3151C7.67634 17.7061 8.31021 17.7061 8.70117 17.3151L17.9012 8.12512C19.0732 6.95264 19.0735 5.05164 17.9012 3.87933Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const PaperclipIcon = assignWithoutSideEffects(_PaperclipIcon, {
  componentId: 'PaperclipIcon',
});

export default PaperclipIcon;
