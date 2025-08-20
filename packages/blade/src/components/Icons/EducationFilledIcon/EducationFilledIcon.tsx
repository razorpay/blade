import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _EducationFilledIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.5 12.5005V19.2879C5.5 19.7489 5.76803 20.1678 6.18657 20.361L11.5047 22.8155C11.819 22.9605 12.181 22.9605 12.4953 22.8155L17.8134 20.361C18.232 20.1678 18.5 19.7489 18.5 19.2879V12.5005L13.1825 15.5728C12.4508 15.9956 11.5492 15.9956 10.8175 15.5728L5.5 12.5005Z"
        fill={iconColor}
      />
      <Path
        d="M10.9434 1.48003C11.5902 1.07759 12.4098 1.07766 13.0567 1.48003L21.1124 6.49272C21.5532 6.76705 21.8388 7.16895 21.9707 7.60893C22.022 7.72916 22.0498 7.8616 22.0499 8.00054V8.04936C22.0567 8.14856 22.0575 8.2481 22.0499 8.34721V14.0005C22.0499 14.5528 21.6021 15.0005 21.0499 15.0005C20.4976 15.0004 20.0499 14.5528 20.0499 14.0005V10.5035L13.001 14.5777C12.382 14.9353 11.6181 14.9354 10.9991 14.5777L2.94341 9.92241C1.63616 9.16683 1.60574 7.29049 2.88774 6.49272L10.9434 1.48003Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const EducationFilledIcon = assignWithoutSideEffects(_EducationFilledIcon, {
  componentId: 'EducationFilledIcon',
});

export default EducationFilledIcon;
