import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _RewindIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 5.00001C12 4.61807 11.7824 4.2695 11.4394 4.10169C11.0963 3.93389 10.6875 3.97617 10.3861 4.21066L1.38606 11.2107C1.14247 11.4001 1 11.6914 1 12C1 12.3086 1.14247 12.5999 1.38606 12.7894L10.3861 19.7894C10.6875 20.0238 11.0963 20.0661 11.4394 19.8983C11.7824 19.7305 12 19.3819 12 19V12C12 12.3086 12.1425 12.5999 12.3861 12.7894L21.3861 19.7894C21.6875 20.0238 22.0963 20.0661 22.4394 19.8983C22.7824 19.7305 23 19.3819 23 19V5.00001C23 4.61807 22.7824 4.2695 22.4394 4.10169C22.0963 3.93389 21.6875 3.97617 21.3861 4.21066L12.3861 11.2107C12.1425 11.4001 12 11.6914 12 12V5.00001ZM10 16.9554L3.62882 12L10 7.04465V16.9554ZM21 16.9554L14.6288 12L21 7.04465V16.9554Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const RewindIcon = assignWithoutSideEffects(_RewindIcon, {
  componentId: 'RewindIcon',
});

export default RewindIcon;
