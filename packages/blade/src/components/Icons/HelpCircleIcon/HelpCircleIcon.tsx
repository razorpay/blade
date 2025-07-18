import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _HelpCircleIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12.2581 8.02434C11.2969 7.85947 10.357 8.4119 10.0333 9.33187C9.85006 9.85286 9.27914 10.1266 8.75815 9.94336C8.23716 9.76009 7.96339 9.18917 8.14666 8.66818C8.79391 6.82824 10.6738 5.72339 12.5962 6.05313C14.5184 6.38284 15.9226 8.05072 15.92 10.0009C15.9195 11.5313 14.7849 12.5419 13.9747 13.0821C13.5391 13.3725 13.1105 13.586 12.7949 13.7263C12.6356 13.7971 12.5015 13.8508 12.4049 13.8876C12.3565 13.9061 12.3173 13.9204 12.2887 13.9305L12.254 13.9427L12.2429 13.9465L12.239 13.9478L12.2375 13.9483C12.2375 13.9483 12.2362 13.9487 11.92 13L12.2362 13.9487C11.7123 14.1234 11.146 13.8402 10.9713 13.3163C10.7968 12.7927 11.0794 12.2267 11.6027 12.0517L11.6187 12.0461C11.6341 12.0406 11.6593 12.0315 11.6929 12.0187C11.7603 11.993 11.8606 11.9529 11.9826 11.8987C12.2294 11.789 12.5509 11.6276 12.8653 11.418C13.5549 10.9582 13.92 10.4692 13.92 10L13.92 9.99854C13.9214 9.0233 13.2193 8.18921 12.2581 8.02434Z"
        fill={iconColor}
      />
      <Path
        d="M12 18C12.5523 18 13 17.5523 13 17C13 16.4477 12.5523 16 12 16C11.4477 16 11 16.4477 11 17C11 17.5523 11.4477 18 12 18Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const HelpCircleIcon = assignWithoutSideEffects(_HelpCircleIcon, {
  componentId: 'HelpCircleIcon',
});

export default HelpCircleIcon;
