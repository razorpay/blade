import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _RazorpayIcon: IconComponent = ({ size, color, variant, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color, variant });

  if (variant === 'colored') {
    return (
      <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
        <Path
          d="M17 7.78125L16.5015 9.59375H7L7.49853 7.78125H17ZM12.5425 20L7.17595 13L7.14663 11.6875H9.81525C10.5093 11.6875 11.1007 11.5833 11.5894 11.375C12.0782 11.1615 12.4521 10.8437 12.7111 10.4219C12.9702 9.99479 13.0997 9.45833 13.0997 8.8125C13.0997 7.85937 12.8309 7.11198 12.2933 6.57031C11.7556 6.02344 10.9296 5.75 9.81525 5.75H7L7.49853 4H9.81525C11.0078 4 11.9853 4.21094 12.7478 4.63281C13.5152 5.04948 14.0821 5.6224 14.4487 6.35156C14.8201 7.07552 15.0059 7.89583 15.0059 8.8125C15.0059 9.64062 14.8348 10.4036 14.4927 11.1016C14.1554 11.7943 13.6129 12.3516 12.8651 12.7734C12.1222 13.1953 11.1398 13.4062 9.91789 13.4062H9.8739L14.8299 19.875V20H12.5425ZM17 4L16.5015 5.8125L9.02346 5.75L9.52199 4H17Z"
          fill={iconColor}
        />
      </Svg>
    );
  }

  if(variant === 'other'){
    return (
      <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5 2C3.34315 2 2 3.34315 2 5V19C2 20.6569 3.34315 22 5 22H19C20.6569 22 22 20.6569 22 19V8C22 7.73478 21.8946 7.48043 21.7071 7.29289L16.7071 2.29289C16.5196 2.10536 16.2652 2 16 2H5ZM5 4C4.44772 4 4 4.44772 4 5V19C4 19.5523 4.44772 20 5 20H6V13C6 12.4477 6.44772 12 7 12H17C17.5523 12 18 12.4477 18 13V20H19C19.5523 20 20 19.5523 20 19V8.41421L15.5858 4H8V7H15C15.5523 7 16 7.44772 16 8C16 8.55228 15.5523 9 15 9H7C6.44772 9 6 8.55228 6 8V4H5ZM8 14V20H16V14H8Z"
          fill={iconColor}
        />
      </Svg>
    );
  }

  if (variant === 'filled') {
    return (
      <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.7596 2L4.1499 18.1112H7.49182L10.5152 14.1753L16.5258 22.0002H20.4316L12.3986 11.7234L19.8675 2H16.7596ZM10.145 9.079L7.82196 5.88974H4.15013L8.22818 11.3079L10.145 9.079Z"
          fill={iconColor}
        />
      </Svg>
    );
  }

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.71749 12.3339L10.7149 8.66299L21 2L15.4844 22.5753L11.6926 22.5722L15.4262 8.64209L9.71749 12.3339ZM3 22.5756L4.57044 16.7193L13.9519 10.6624L10.7718 22.5756H3Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const RazorpayIcon = assignWithoutSideEffects(_RazorpayIcon, {
  componentId: 'RazorpayIcon',
});

export default RazorpayIcon;
