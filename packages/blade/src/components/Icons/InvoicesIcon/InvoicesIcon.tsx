import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _InvoicesIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 4C3 2.34314 4.34315 1 6 1H18C19.6569 1 21 2.34315 21 4V12C21 12.5523 20.5523 13 20 13C19.4477 13 19 12.5523 19 12V4C19 3.44772 18.5523 3 18 3H6C5.44772 3 5 3.44772 5 4V18.8584C5 19.7704 6.12089 20.2064 6.73716 19.5341L7.35136 18.8641C8.5055 17.605 10.4764 17.5622 11.6841 18.7699L13.2071 20.2929C13.5976 20.6834 13.5976 21.3166 13.2071 21.7071C12.8166 22.0976 12.1834 22.0976 11.7929 21.7071L10.2699 20.1841C9.86735 19.7816 9.21038 19.7958 8.82567 20.2155L8.21146 20.8856C6.36267 22.9024 3 21.5944 3 18.8584V4Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.9617 13.2975C17.9602 13.296 17.9587 13.2944 17.9571 13.2929C17.5766 12.9124 16.9659 12.9026 16.5735 13.2635C16.5621 13.274 16.551 13.2847 16.5401 13.2957L13.7929 16.0429C13.4024 16.4334 13.4024 17.0666 13.7929 17.4571C14.1834 17.8476 14.8166 17.8476 15.2071 17.4571L16.25 16.4142V21C16.25 21.5523 16.6977 22 17.25 22C17.8023 22 18.25 21.5523 18.25 21V16.4142L19.2929 17.4571C19.6834 17.8477 20.3166 17.8477 20.7071 17.4571C21.0976 17.0666 21.0976 16.4334 20.7071 16.0429L17.9617 13.2975Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 7C7 6.44772 7.44772 6 8 6H16C16.5523 6 17 6.44772 17 7C17 7.55228 16.5523 8 16 8H8C7.44772 8 7 7.55228 7 7Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 11C8 10.4477 8.44772 10 9 10H15C15.5523 10 16 10.4477 16 11C16 11.5523 15.5523 12 15 12H9C8.44772 12 8 11.5523 8 11Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const InvoicesIcon = assignWithoutSideEffects(_InvoicesIcon, {
  componentId: 'InvoicesIcon',
});

export default InvoicesIcon;
