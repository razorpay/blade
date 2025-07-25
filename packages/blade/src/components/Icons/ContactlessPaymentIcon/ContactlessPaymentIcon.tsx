import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _ContactlessPaymentIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13.3421 5.86784C13.8294 5.60795 14.4352 5.7923 14.6951 6.27961C15.634 8.0402 16.1252 10.0049 16.1252 12.0002C16.1252 13.9955 15.634 15.9602 14.6951 17.7208C14.4352 18.2081 13.8294 18.3924 13.3421 18.1325C12.8548 17.8727 12.6704 17.2669 12.9303 16.7796C13.7148 15.3087 14.1252 13.6673 14.1252 12.0002C14.1252 10.3331 13.7148 8.69172 12.9303 7.22079C12.6704 6.73348 12.8548 6.12774 13.3421 5.86784Z"
        fill={iconColor}
      />
      <Path
        d="M9.96711 7.36784C10.4544 7.10795 11.0602 7.2923 11.3201 7.77961C12.0128 9.07855 12.3752 10.5281 12.3752 12.0002C12.3752 13.4723 12.0128 14.9218 11.3201 16.2208C11.0602 16.7081 10.4544 16.8924 9.96711 16.6326C9.4798 16.3727 9.29545 15.7669 9.55534 15.2796C10.0936 14.2703 10.3752 13.1441 10.3752 12.0002C10.3752 10.8563 10.0936 9.73007 9.55534 8.72079C9.29545 8.23348 9.4798 7.62774 9.96711 7.36784Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.5 2C6.97715 2 2.5 6.47715 2.5 12C2.5 17.5228 6.97715 22 12.5 22C18.0228 22 22.5 17.5228 22.5 12C22.5 6.47715 18.0228 2 12.5 2ZM4.5 12C4.5 7.58172 8.08172 4 12.5 4C16.9183 4 20.5 7.58172 20.5 12C20.5 16.4183 16.9183 20 12.5 20C8.08172 20 4.5 16.4183 4.5 12Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const ContactlessPaymentIcon = assignWithoutSideEffects(_ContactlessPaymentIcon, {
  componentId: 'ContactlessPaymentIcon',
});

export default ContactlessPaymentIcon;
