import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _EngageFilledIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2.10156 17.0005C2.10156 15.8959 2.99699 15.0005 4.10156 15.0005H20.1016C21.2061 15.0005 22.1016 15.8959 22.1016 17.0005V20.0005C22.1016 21.1051 21.2061 22.0005 20.1016 22.0005H4.10156C2.99699 22.0005 2.10156 21.1051 2.10156 20.0005V17.0005Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.2031 1.00049C18.4123 1.00049 20.2031 2.79135 20.2031 5.00049V13.0005C20.2031 13.5528 19.7554 14.0005 19.2031 14.0005H5.20312C4.65084 14.0005 4.20312 13.5528 4.20312 13.0005V5.00049C4.20312 2.79135 5.99399 1.00049 8.20312 1.00049H16.2031ZM14.2031 4.50049C13.6509 4.50052 13.2031 4.94822 13.2031 5.50049C13.2031 5.88916 13.4251 6.22562 13.749 6.39111L12.2344 7.61768L11.5303 6.78174C11.1793 6.36505 10.5591 6.30606 10.1357 6.64893L7.57422 8.72314C7.14517 9.07062 7.07858 9.70022 7.42578 10.1294C7.77326 10.5585 8.40285 10.6251 8.83203 10.2778L10.6328 8.81982L11.3369 9.65674C11.6879 10.0732 12.3082 10.1324 12.7314 9.78955L15.2373 7.76025C15.3517 8.18657 15.7407 8.50046 16.2031 8.50049C16.7554 8.50049 17.2031 8.05277 17.2031 7.50049V5.50049C17.2031 4.9482 16.7554 4.50049 16.2031 4.50049H14.2031Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const EngageFilledIcon = assignWithoutSideEffects(_EngageFilledIcon, {
  componentId: 'EngageFilledIcon',
});

export default EngageFilledIcon;
