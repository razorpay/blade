import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _CloudIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.49 9.03035C16.0571 4.92085 11.8447 2.38597 7.48289 3.12888C2.87459 3.91377 -0.365067 8.09579 0.0254798 12.753C0.117783 14.1388 0.668746 16.1709 2.04113 17.8809C3.4493 19.6355 5.68721 21.0011 9 21.0011H18C21.3137 21.0011 24 18.3148 24 15.0011C24 12.7932 22.9167 11.2456 21.45 10.2921C20.2557 9.51567 18.8182 9.13333 17.49 9.03035ZM15.7717 10.2511C14.8621 6.72827 11.4054 4.48959 7.81869 5.10049C4.23197 5.71138 1.71123 8.96815 2.01912 12.5935L2.02059 12.6131C2.08936 13.6681 2.52769 15.2918 3.6009 16.6291C4.6416 17.9258 6.31279 19.0011 9 19.0011H18C20.2091 19.0011 22 17.2102 22 15.0011C22 13.5541 21.3333 12.6017 20.3599 11.9689C19.3434 11.3081 17.9824 11.0011 16.74 11.0011C16.284 11.0011 15.8857 10.6926 15.7717 10.2511Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const CloudIcon = assignWithoutSideEffects(_CloudIcon, {
  componentId: 'CloudIcon',
});

export default CloudIcon;
