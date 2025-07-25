import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _DisbursePaymentsIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.2929 2.79289C19.6834 2.40237 20.3166 2.40237 20.7071 2.79289L22.7071 4.79289C23.0976 5.18342 23.0976 5.81658 22.7071 6.20711C22.3166 6.59763 21.6834 6.59763 21.2929 6.20711L21 5.91421V9.5C21 10.0523 20.5523 10.5 20 10.5C19.4477 10.5 19 10.0523 19 9.5V5.91421L18.7071 6.20711C18.3166 6.59763 17.6834 6.59763 17.2929 6.20711C16.9024 5.81658 16.9024 5.18342 17.2929 4.79289L19.2929 2.79289ZM3 5C2.44772 5 2 5.44772 2 6V9H15C15.5523 9 16 9.44772 16 10C16 10.5523 15.5523 11 15 11H2V18C2 18.5523 2.44772 19 3 19H21C21.5523 19 22 18.5523 22 18V13.5C22 12.9477 22.4477 12.5 23 12.5C23.5523 12.5 24 12.9477 24 13.5V18C24 19.6569 22.6569 21 21 21H3C1.34315 21 0 19.6569 0 18V6C0 4.34315 1.34315 3 3 3H14.25C14.8023 3 15.25 3.44772 15.25 4C15.25 4.55228 14.8023 5 14.25 5H3ZM4 16.5C4 15.9477 4.44772 15.5 5 15.5H7C7.55228 15.5 8 15.9477 8 16.5C8 17.0523 7.55228 17.5 7 17.5H5C4.44772 17.5 4 17.0523 4 16.5ZM8.5 16.5C8.5 15.9477 8.94772 15.5 9.5 15.5H13.5C14.0523 15.5 14.5 15.9477 14.5 16.5C14.5 17.0523 14.0523 17.5 13.5 17.5H9.5C8.94772 17.5 8.5 17.0523 8.5 16.5Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const DisbursePaymentsIcon = assignWithoutSideEffects(_DisbursePaymentsIcon, {
  componentId: 'DisbursePaymentsIcon',
});

export default DisbursePaymentsIcon;
