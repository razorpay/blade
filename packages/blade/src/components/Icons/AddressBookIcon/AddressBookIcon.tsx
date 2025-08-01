import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _AddressBookIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.25 6.5C11.0409 6.5 9.25 8.29086 9.25 10.5C9.25 11.5385 9.64578 12.4846 10.2947 13.1957C9.58045 13.5517 8.93552 14.0343 8.39167 14.6209C8.01619 15.0259 8.04013 15.6586 8.44514 16.0341C8.85014 16.4096 9.48286 16.3856 9.85834 15.9806C10.2913 15.5136 10.816 15.1411 11.3996 14.8863C11.9832 14.6315 12.6132 14.5 13.25 14.5C13.8868 14.5 14.5168 14.6315 15.1004 14.8863C15.684 15.1411 16.2087 15.5136 16.6417 15.9806C17.0172 16.3856 17.6499 16.4096 18.0549 16.0341C18.4599 15.6586 18.4838 15.0259 18.1083 14.6209C17.5645 14.0343 16.9195 13.5517 16.2053 13.1957C16.8542 12.4846 17.25 11.5385 17.25 10.5C17.25 8.29086 15.4591 6.5 13.25 6.5ZM11.25 10.5C11.25 9.39543 12.1454 8.5 13.25 8.5C14.3546 8.5 15.25 9.39543 15.25 10.5C15.25 11.6046 14.3546 12.5 13.25 12.5C12.1454 12.5 11.25 11.6046 11.25 10.5Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.5 5.75H4.75V3.75C4.75 2.7835 5.5335 2 6.5 2H20C20.9665 2 21.75 2.7835 21.75 3.75V20.25C21.75 21.2165 20.9665 22 20 22H6.5C5.5335 22 4.75 21.2165 4.75 20.25V18.25H3.5C2.94772 18.25 2.5 17.8023 2.5 17.25C2.5 16.6977 2.94772 16.25 3.5 16.25H4.75V13H3.5C2.94772 13 2.5 12.5523 2.5 12C2.5 11.4477 2.94772 11 3.5 11H4.75V7.75H3.5C2.94772 7.75 2.5 7.30228 2.5 6.75C2.5 6.19772 2.94772 5.75 3.5 5.75ZM19.75 4H6.75V20H19.75V4Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const AddressBookIcon = assignWithoutSideEffects(_AddressBookIcon, {
  componentId: 'AddressBookIcon',
});

export default AddressBookIcon;
