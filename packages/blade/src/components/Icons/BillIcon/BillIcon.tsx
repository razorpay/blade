import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _BillIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8.36841 8.13722C7.81612 8.13722 7.36841 8.58786 7.36841 9.14376C7.36841 9.69965 7.81612 10.1503 8.36841 10.1503H14.9579C15.5102 10.1503 15.9579 9.69965 15.9579 9.14376C15.9579 8.58786 15.5102 8.13722 14.9579 8.13722H8.36841Z"
        fill={iconColor}
      />
      <Path
        d="M7.36841 6.03268C7.36841 5.47678 7.81612 5.02614 8.36841 5.02614H14.9579C15.5102 5.02614 15.9579 5.47678 15.9579 6.03268C15.9579 6.58857 15.5102 7.03921 14.9579 7.03921H8.36841C7.81612 7.03921 7.36841 6.58857 7.36841 6.03268Z"
        fill={iconColor}
      />
      <Path
        d="M8.36841 11.7974C7.81612 11.7974 7.36841 12.248 7.36841 12.8039C7.36841 13.3598 7.81612 13.8105 8.36841 13.8105H10.5789C11.1312 13.8105 11.5789 13.3598 11.5789 12.8039C11.5789 12.248 11.1312 11.7974 10.5789 11.7974H8.36841Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19 1C20.1046 1 21 1.90128 21 3.01307V22.0901C21 22.5132 20.5127 22.7474 20.1857 22.4815L16.8143 19.7393C16.6309 19.5902 16.3691 19.5902 16.1857 19.7393L12.3143 22.8882C12.1309 23.0373 11.8691 23.0373 11.6857 22.8882L7.81426 19.7393C7.63094 19.5902 7.36906 19.5902 7.18574 19.7393L3.81426 22.4815C3.48728 22.7474 3 22.5132 3 22.0901V3.01307C3 1.90128 3.89543 1 5 1H19ZM5 3.01307H19V18.9289L18.0713 18.1735C17.1547 17.428 15.8453 17.428 14.9287 18.1735L12 20.5556L9.0713 18.1735C8.1547 17.428 6.8453 17.428 5.9287 18.1735L5 18.9289V3.01307Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const BillIcon = assignWithoutSideEffects(_BillIcon, {
  componentId: 'BillIcon',
});

export default BillIcon;
