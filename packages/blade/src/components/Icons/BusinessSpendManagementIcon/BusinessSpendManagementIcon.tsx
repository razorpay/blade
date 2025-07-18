import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _BusinessSpendManagementIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 4C3 2.34314 4.34315 1 6 1H18C19.6569 1 21 2.34315 21 4V12C21 12.5523 20.5523 13 20 13C19.4477 13 19 12.5523 19 12V4C19 3.44772 18.5523 3 18 3H6C5.44771 3 5 3.44772 5 4V18.8584C5 19.7704 6.12089 20.2064 6.73716 19.5341L7.35136 18.8641C8.5055 17.605 10.4764 17.5622 11.6841 18.7699L13.2071 20.2929C13.5976 20.6834 13.5976 21.3166 13.2071 21.7071C12.8166 22.0976 12.1834 22.0976 11.7929 21.7071L10.2699 20.1841C9.86735 19.7816 9.21038 19.7958 8.82567 20.2155L8.21146 20.8856C6.36267 22.9024 3 21.5944 3 18.8584V4ZM7 7C7 6.44772 7.44772 6 8 6H16C16.5523 6 17 6.44772 17 7C17 7.55228 16.5523 8 16 8H8C7.44772 8 7 7.55228 7 7ZM8 11C8 10.4477 8.44772 10 9 10H15C15.5523 10 16 10.4477 16 11C16 11.5523 15.5523 12 15 12H9C8.44772 12 8 11.5523 8 11ZM17.25 15.5C16.2835 15.5 15.5 16.2835 15.5 17.25C15.5 18.2165 16.2835 19 17.25 19C18.2165 19 19 18.2165 19 17.25C19 16.2835 18.2165 15.5 17.25 15.5ZM13.5 17.25C13.5 15.1789 15.1789 13.5 17.25 13.5C19.3211 13.5 21 15.179 21 17.25C21 17.9223 20.8231 18.5534 20.5132 19.099L21.7071 20.2929C22.0976 20.6834 22.0976 21.3166 21.7071 21.7071C21.3166 22.0976 20.6834 22.0976 20.2929 21.7071L19.099 20.5132C18.5534 20.8231 17.9223 21 17.25 21C15.179 21 13.5 19.3211 13.5 17.25Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const BusinessSpendManagementIcon = assignWithoutSideEffects(_BusinessSpendManagementIcon, {
  componentId: 'BusinessSpendManagementIcon',
});

export default BusinessSpendManagementIcon;
