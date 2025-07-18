import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _FreelanceIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.87868 2.87868C8.44129 2.31607 9.20435 2 10 2H14C14.7956 2 15.5587 2.31607 16.1213 2.87868C16.6839 3.44129 17 4.20435 17 5V6H20C21.6569 6 23 7.34315 23 9V19C23 20.6569 21.6569 22 20 22H4C2.34315 22 1 20.6569 1 19V9C1 7.34315 2.34315 6 4 6H7V5C7 4.20435 7.31607 3.44129 7.87868 2.87868ZM7 8H4C3.44772 8 3 8.44772 3 9V19C3 19.5523 3.44772 20 4 20H7V8ZM9 20V8H15V20H9ZM17 20H20C20.5523 20 21 19.5523 21 19V9C21 8.44771 20.5523 8 20 8H17V20ZM15 6H9V5C9 4.73478 9.10536 4.48043 9.29289 4.29289C9.48043 4.10536 9.73478 4 10 4H14C14.2652 4 14.5196 4.10536 14.7071 4.29289C14.8946 4.48043 15 4.73478 15 5V6Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const FreelanceIcon = assignWithoutSideEffects(_FreelanceIcon, {
  componentId: 'FreelanceIcon',
});

export default FreelanceIcon;
