import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _WalletFilledIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.25 4C17.8023 4 18.25 4.44772 18.25 5C18.25 5.55228 17.8023 6 17.25 6H4.5C4.36739 6 4.24025 6.05272 4.14648 6.14648C4.05272 6.24025 4 6.36739 4 6.5C4 6.63261 4.05272 6.75975 4.14648 6.85352C4.24025 6.94728 4.36739 7 4.5 7H19.5C19.9641 7 20.4091 7.18451 20.7373 7.5127C21.0655 7.84089 21.25 8.28587 21.25 8.75V19.25C21.25 19.7141 21.0655 20.1591 20.7373 20.4873C20.4091 20.8155 19.9641 21 19.5 21H4.5C3.83696 21 3.20126 20.7364 2.73242 20.2676C2.26358 19.7987 2 19.163 2 18.5V6.5C2 5.83696 2.26358 5.20126 2.73242 4.73242C3.20126 4.26358 3.83696 4 4.5 4H17.25ZM16.125 12.5C15.5037 12.5 15 13.0037 15 13.625C15 14.2463 15.5037 14.75 16.125 14.75C16.7463 14.75 17.25 14.2463 17.25 13.625C17.25 13.0037 16.7463 12.5 16.125 12.5Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const WalletFilledIcon = assignWithoutSideEffects(_WalletFilledIcon, {
  componentId: 'WalletFilledIcon',
});

export default WalletFilledIcon;
