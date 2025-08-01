import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _CashIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.875 12C8.875 9.99797 10.498 8.375 12.5 8.375C14.502 8.375 16.125 9.99797 16.125 12C16.125 14.002 14.502 15.625 12.5 15.625C10.498 15.625 8.875 14.002 8.875 12ZM12.5 10.375C11.6025 10.375 10.875 11.1025 10.875 12C10.875 12.8975 11.6025 13.625 12.5 13.625C13.3975 13.625 14.125 12.8975 14.125 12C14.125 11.1025 13.3975 10.375 12.5 10.375Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 5C1.44772 5 1 5.44772 1 6V18C1 18.5523 1.44772 19 2 19H23C23.5523 19 24 18.5523 24 18V6C24 5.44772 23.5523 5 23 5H2ZM7.40835 17H17.5917C17.7926 15.9131 18.3183 14.9035 19.1109 14.1109C19.9035 13.3183 20.9131 12.7926 22 12.5916V11.4084C20.9131 11.2074 19.9035 10.6817 19.1109 9.88909C18.3183 9.09651 17.7926 8.08693 17.5917 7H7.40835C7.20737 8.08693 6.68167 9.09651 5.88909 9.88909C5.09651 10.6817 4.08693 11.2074 3 11.4084V12.5916C4.08693 12.7926 5.09651 13.3183 5.88909 14.1109C6.68167 14.9035 7.20737 15.9131 7.40835 17ZM3 14.6459C3.55205 14.8105 4.06015 15.1104 4.47487 15.5251C4.8896 15.9399 5.1895 16.4479 5.35411 17H3V14.6459ZM22 17H19.6459C19.8105 16.4479 20.1104 15.9399 20.5251 15.5251C20.9399 15.1104 21.4479 14.8105 22 14.6459V17ZM5.35411 7H3V9.35411C3.55205 9.1895 4.06015 8.8896 4.47487 8.47487C4.8896 8.06015 5.1895 7.55205 5.35411 7ZM22 9.35411C21.4479 9.1895 20.9399 8.8896 20.5251 8.47487C20.1104 8.06015 19.8105 7.55205 19.6459 7H22V9.35411Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const CashIcon = assignWithoutSideEffects(_CashIcon, {
  componentId: 'CashIcon',
});

export default CashIcon;
