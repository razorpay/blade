import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _AtSignIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.4999 1.28843C9.52184 0.126697 4.39951 2.54737 2.13656 7.13099C-0.126387 11.7146 1.06648 17.2531 5.01567 20.4988C8.96487 23.7445 14.6295 23.8419 18.688 20.7339C19.1265 20.3981 19.2097 19.7704 18.8739 19.332C18.5381 18.8935 17.9105 18.8102 17.472 19.146C14.1514 21.6889 9.51671 21.6092 6.28555 18.9537C3.05439 16.2981 2.07841 11.7666 3.92991 8.01638C5.78141 4.26614 9.97241 2.28559 14.0454 3.23609C18.1183 4.18659 20.9997 7.81767 21 12V13C21 14.1045 20.1046 15 19 15C17.8954 15 17 14.1045 17 13V12.0139C17 12.0093 17 12.0046 17 12C17 9.23855 14.7614 6.99997 12 6.99997C9.23858 6.99997 7 9.23855 7 12C7 14.7614 9.23858 17 12 17C13.488 17 14.8241 16.35 15.7401 15.3185C16.4652 16.3362 17.6551 17 19 17C21.2091 17 23 15.2091 23 13V11.9999C22.9997 6.88809 19.4779 2.45015 14.4999 1.28843ZM15 11.9944L15 12V12.011C14.994 13.6628 13.6532 15 12 15C10.3431 15 9 13.6568 9 12C9 10.3431 10.3431 8.99997 12 8.99997C13.655 8.99997 14.997 10.3401 15 11.9944Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const AtSignIcon = assignWithoutSideEffects(_AtSignIcon, {
  componentId: 'AtSignIcon',
});

export default AtSignIcon;
