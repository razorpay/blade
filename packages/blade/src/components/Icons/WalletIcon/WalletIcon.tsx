import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _WalletIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17.75 13.625C17.75 14.2463 17.2463 14.75 16.625 14.75C16.0037 14.75 15.5 14.2463 15.5 13.625C15.5 13.0037 16.0037 12.5 16.625 12.5C17.2463 12.5 17.75 13.0037 17.75 13.625Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.64645 6.14645C4.74021 6.05268 4.86739 6 5 6H17.75C18.3023 6 18.75 5.55228 18.75 5C18.75 4.44772 18.3023 4 17.75 4H5C4.33696 4 3.70107 4.26339 3.23223 4.73223C2.76339 5.20107 2.5 5.83696 2.5 6.5V18.5C2.5 19.163 2.76339 19.7989 3.23223 20.2678C3.70107 20.7366 4.33696 21 5 21H20C20.4641 21 20.9092 20.8156 21.2374 20.4874C21.5656 20.1592 21.75 19.7141 21.75 19.25V8.75C21.75 8.28587 21.5656 7.84075 21.2374 7.51256C20.9092 7.18437 20.4641 7 20 7H5C4.86739 7 4.74022 6.94732 4.64645 6.85355C4.55268 6.75978 4.5 6.63261 4.5 6.5C4.5 6.36739 4.55268 6.24021 4.64645 6.14645ZM4.5 18.5V8.9495C4.66335 8.98285 4.83079 9 5 9H19.75V19H5C4.86739 19 4.74022 18.9473 4.64645 18.8536C4.55268 18.7598 4.5 18.6326 4.5 18.5Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const WalletIcon = assignWithoutSideEffects(_WalletIcon, {
  componentId: 'WalletIcon',
});

export default WalletIcon;
