import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _HeartIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.3529 3.90277C13.5719 2.68322 15.2256 1.99805 16.95 1.99805C18.6743 1.99805 20.3279 2.68316 21.5469 3.9026C22.7664 5.12164 23.4518 6.77559 23.4518 8.49987C23.4518 10.2242 22.7666 11.8779 21.5471 13.097C21.547 13.097 21.5472 13.0969 21.5471 13.097L12.7071 21.937C12.3166 22.3275 11.6834 22.3275 11.2929 21.937L2.45289 13.097C-0.086022 10.5581 -0.0860219 6.44168 2.45289 3.90277C4.9918 1.36385 9.10819 1.36385 11.6471 3.90277L12 4.25566L12.3529 3.90277C12.3529 3.90271 12.3528 3.90282 12.3529 3.90277ZM16.95 3.99805C15.7562 3.99805 14.6112 4.47244 13.7673 5.31681L12.7071 6.37698C12.5196 6.56452 12.2652 6.66987 12 6.66987C11.7348 6.66987 11.4804 6.56452 11.2929 6.37698L10.2329 5.31698C8.47503 3.55912 5.62497 3.55912 3.8671 5.31698C2.10924 7.07484 2.10924 9.9249 3.8671 11.6828L12 19.8157L20.1329 11.6828C20.9773 10.8388 21.4518 9.69371 21.4518 8.49987C21.4518 7.30603 20.9774 6.16112 20.1331 5.31715C19.2891 4.47277 18.1438 3.99805 16.95 3.99805Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const HeartIcon = assignWithoutSideEffects(_HeartIcon, {
  componentId: 'HeartIcon',
});

export default HeartIcon;
