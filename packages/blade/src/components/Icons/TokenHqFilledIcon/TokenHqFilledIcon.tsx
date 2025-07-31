import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _TokenHqFilledIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9.53027 21.5311V2.67396C9.53027 2.30201 9.8318 2.00049 10.2037 2.00049C10.5757 2.00049 10.8772 2.30201 10.8772 2.67396V21.5311C10.8772 21.903 10.5757 22.2046 10.2037 22.2046C9.8318 22.2046 9.53027 21.903 9.53027 21.5311Z"
        fill={iconColor}
      />
      <Path
        d="M22.1016 18.8369C22.1016 19.9527 20.7034 20.8573 18.9785 20.8574H10.877V10.7559H22.1016V18.8369Z"
        fill={iconColor}
      />
      <Path
        d="M18.9785 4.69434C20.7034 4.69444 22.1016 5.59907 22.1016 6.71484V9.4082H10.877V4.69434H18.9785Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.63281 20.8575H3.12402C1.95104 20.8575 1 19.9528 1 18.837V6.71488C1 5.59904 1.95104 4.69438 3.12402 4.69438H8.63281V20.8575ZM4.36719 10.0821C3.99531 10.0822 3.69434 10.384 3.69434 10.7559C3.69448 11.1277 3.9954 11.4287 4.36719 11.4288C4.73905 11.4288 5.04088 11.1277 5.04102 10.7559C5.04102 10.384 4.73913 10.0821 4.36719 10.0821ZM7.06152 10.0821C6.68958 10.0821 6.3877 10.384 6.3877 10.7559C6.38784 11.1277 6.68966 11.4288 7.06152 11.4288C7.43325 11.4286 7.73423 11.1276 7.73438 10.7559C7.73438 10.3841 7.43333 10.0822 7.06152 10.0821Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const TokenHqFilledIcon = assignWithoutSideEffects(_TokenHqFilledIcon, {
  componentId: 'TokenHqFilledIcon',
});

export default TokenHqFilledIcon;
