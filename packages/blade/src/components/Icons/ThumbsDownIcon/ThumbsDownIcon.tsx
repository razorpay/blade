import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _ThumbsDownIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21 4.07665C20.8867 3.4474 20.3326 2.98832 19.6877 2.99972L19.67 2.99988H18V11.9999H19.67L19.6877 12C20.3326 12.0114 20.8867 11.5524 21 10.9231V4.07665ZM16 12.7877V2.99988H5.7087C5.21005 2.99424 4.78347 3.35678 4.7087 3.84982L3.32868 12.8499C3.32864 12.8502 3.32871 12.8497 3.32868 12.8499C3.28487 13.1398 3.37037 13.435 3.56275 13.6562C3.75527 13.8776 4.0353 14.0033 4.32868 13.9999L4.34 13.9998L10 13.9999C10.5523 13.9999 11 14.4476 11 14.9999V18.9999C11 19.8924 11.5847 20.6484 12.392 20.9058L16 12.7877ZM17.6499 13.9999L13.9138 22.406C13.7533 22.7671 13.3952 22.9999 13 22.9999C10.7909 22.9999 9 21.209 9 18.9999V15.9999H4.34512C3.46725 16.008 2.62974 15.6312 2.05354 14.9685C1.47598 14.3044 1.21924 13.42 1.35132 12.5498L2.7313 3.54994C2.73126 3.55024 2.73135 3.54964 2.7313 3.54994C2.95568 2.07334 4.23214 0.986049 5.72509 0.999881H19.6619C21.3364 0.975058 22.7664 2.20528 22.991 3.86584C22.997 3.91027 23 3.95505 23 3.99988V10.9999C23 11.0447 22.997 11.0895 22.991 11.1339C22.7664 12.7945 21.3364 14.0247 19.6619 13.9999H17.6499Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const ThumbsDownIcon = assignWithoutSideEffects(_ThumbsDownIcon, {
  componentId: 'ThumbsDownIcon',
});

export default ThumbsDownIcon;
