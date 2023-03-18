import type { ReactElement } from 'react';
import { Svg, Path, G, Defs, ClipPath, Rect } from '../_Svg';
import type { IconProps } from '..';
import useIconProps from '../useIconProps';

const CheckCircleIcon = ({ size, color, ...styledProps }: IconProps): ReactElement => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#clip0_60_208)">
        <Path
          d="M4.15845 7.14679C6.74812 4.11688 11.0222 3.1512 14.663 4.77343C15.1675 4.99821 15.7586 4.77147 15.9834 4.267C16.2082 3.76253 15.9815 3.17135 15.477 2.94657C11.0272 0.96385 5.80325 2.14413 2.6381 5.84735C-0.527049 9.55057 -0.879431 14.8946 1.77205 18.9813C4.42353 23.0681 9.44725 24.9241 14.1189 23.5429C18.7905 22.1616 21.9972 17.8716 22 13V12.07C22 11.5177 21.5523 11.07 21 11.07C20.4477 11.07 20 11.5177 20 12.07V12.9994C19.9977 16.9852 17.3741 20.4948 13.5518 21.6249C9.72957 22.7551 5.61926 21.2365 3.44986 17.8928C1.28047 14.5491 1.56878 10.1767 4.15845 7.14679Z"
          fill={iconColor}
        />
        <Path
          d="M22.7071 4.70711C23.0976 4.31658 23.0976 3.68342 22.7071 3.29289C22.3166 2.90237 21.6834 2.90237 21.2929 3.29289L11 13.5858L8.70711 11.2929C8.31658 10.9024 7.68342 10.9024 7.29289 11.2929C6.90237 11.6834 6.90237 12.3166 7.29289 12.7071L10.2929 15.7071C10.6834 16.0976 11.3166 16.0976 11.7071 15.7071L22.7071 4.70711Z"
          fill={iconColor}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_60_208">
          <Rect width="24" height="24" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default CheckCircleIcon;
