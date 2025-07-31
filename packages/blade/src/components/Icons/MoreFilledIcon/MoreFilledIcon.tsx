import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _MoreFilledIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg
      {...styledProps}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 1.00049C18.0751 1.00049 23 5.92536 23 12.0005C23 18.0756 18.0751 23.0005 12 23.0005C5.92487 23.0005 1 18.0756 1 12.0005C1 5.92536 5.92487 1.00049 12 1.00049ZM13.207 8.29346C12.8165 7.90293 12.1835 7.90293 11.793 8.29346C11.4024 8.68398 11.4024 9.317 11.793 9.70752L13.0859 11.0005H8.5C7.94772 11.0005 7.5 11.4482 7.5 12.0005C7.5 12.5528 7.94772 13.0005 8.5 13.0005H13.0859L11.793 14.2935C11.4024 14.684 11.4024 15.317 11.793 15.7075C12.1835 16.098 12.8165 16.098 13.207 15.7075L16.207 12.7075C16.5976 12.317 16.5976 11.684 16.207 11.2935L13.207 8.29346Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const MoreFilledIcon = assignWithoutSideEffects(_MoreFilledIcon, {
  componentId: 'MoreFilledIcon',
});

export default MoreFilledIcon;
