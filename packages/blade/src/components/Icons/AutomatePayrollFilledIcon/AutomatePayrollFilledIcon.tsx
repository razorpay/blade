import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _AutomatePayrollFilledIcon: IconComponent = ({
  size,
  color,
  ...styledProps
}) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg
      {...styledProps}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.6 1.00049C19.815 1.00049 20.8 1.89592 20.8 3.00049V9.76416C20.8 10.5217 20.3292 11.2144 19.584 11.5532L12.984 14.5532C12.3646 14.8348 11.6354 14.8348 11.016 14.5532L4.41602 11.5532C3.67076 11.2144 3.2 10.5217 3.2 9.76416V3.00049C3.2 1.89592 4.18497 1.00049 5.4 1.00049H18.6ZM11.9817 3.25244C11.9534 3.25359 11.9251 3.25544 11.8969 3.25928C11.872 3.26236 11.8473 3.26585 11.8228 3.271C11.8188 3.27188 11.8149 3.27299 11.8109 3.27393C11.6698 3.30554 11.5356 3.36993 11.4253 3.47021L8.74404 5.90771C8.42186 6.20061 8.42186 6.67537 8.74404 6.96826C9.06623 7.26116 9.58846 7.26116 9.91064 6.96826L11.1943 5.80127V9.50049C11.1943 9.9147 11.5637 10.2505 12.0193 10.2505C12.475 10.2505 12.8443 9.9147 12.8443 9.50049V5.81104L14.0829 6.93701L14.1452 6.98877C14.4693 7.22908 14.9474 7.21162 15.2495 6.93701C15.5516 6.66241 15.5708 6.22769 15.3064 5.93311L15.2495 5.87646L12.6026 3.47021C12.4465 3.32825 12.2382 3.2532 12.0258 3.25146C12.0111 3.25119 11.9964 3.25201 11.9817 3.25244Z"
        fill={iconColor}
      />
      <Path
        d="M1 15.0509C1 13.5286 2.72109 12.5385 4.18387 13.2193L11.0161 16.3991C11.6355 16.6874 12.3645 16.6874 12.9839 16.3991L19.8161 13.2193C21.2789 12.5385 23 13.5286 23 15.0509V20.9527C23 22.0837 22.015 23.0005 20.8 23.0005H3.2C1.98497 23.0005 1 22.0837 1 20.9527V15.0509Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const AutomatePayrollFilledIcon = assignWithoutSideEffects(
  _AutomatePayrollFilledIcon,
  {
    componentId: 'AutomatePayrollFilledIcon',
  }
);

export default AutomatePayrollFilledIcon;
