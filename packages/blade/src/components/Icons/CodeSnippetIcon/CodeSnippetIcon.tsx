import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _CodeSnippetIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.83211 2.29289C7.22263 2.68342 7.22263 3.31658 6.83211 3.70711L4.53921 6L6.83211 8.29289C7.22263 8.68342 7.22263 9.31658 6.83211 9.70711C6.44158 10.0976 5.80842 10.0976 5.41789 9.70711L2.41789 6.70711C2.02737 6.31658 2.02737 5.68342 2.41789 5.29289L5.41789 2.29289C5.80842 1.90237 6.44158 1.90237 6.83211 2.29289Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.91789 2.29289C10.3084 1.90237 10.9416 1.90237 11.3321 2.29289L14.3321 5.29289C14.7226 5.68342 14.7226 6.31658 14.3321 6.70711L11.3321 9.70711C10.9416 10.0976 10.3084 10.0976 9.91789 9.70711C9.52737 9.31658 9.52737 8.68342 9.91789 8.29289L12.2108 6L9.91789 3.70711C9.52737 3.31658 9.52737 2.68342 9.91789 2.29289Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.375 4.5C16.375 3.94772 16.8227 3.5 17.375 3.5H19.25C19.7141 3.5 20.1592 3.68437 20.4874 4.01256C20.8156 4.34075 21 4.78587 21 5.25V18.75C21 19.2141 20.8156 19.6592 20.4874 19.9874C20.1592 20.3156 19.7141 20.5 19.25 20.5H5.75C5.28587 20.5 4.84075 20.3156 4.51256 19.9874C4.18437 19.6592 4 19.2141 4 18.75V13.125C4 12.5727 4.44772 12.125 5 12.125C5.55228 12.125 6 12.5727 6 13.125V18.5H19V5.5H17.375C16.8227 5.5 16.375 5.05228 16.375 4.5Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const CodeSnippetIcon = assignWithoutSideEffects(_CodeSnippetIcon, {
  componentId: 'CodeSnippetIcon',
});

export default CodeSnippetIcon;
