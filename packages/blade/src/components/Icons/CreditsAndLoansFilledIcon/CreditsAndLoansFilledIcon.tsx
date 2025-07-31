import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _CreditsAndLoansFilledIcon: IconComponent = ({
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
        d="M8.51363 6.17811C5.92422 6.82771 4 9.18417 4 12.0005C4 14.8168 5.92422 17.1733 8.51364 17.8229C6.96606 16.3641 6 14.2951 6 12.0005C6 9.70588 6.96605 7.63691 8.51363 6.17811ZM11.9731 4.2595C11.8009 4.2143 11.6264 4.17475 11.4499 4.14106C10.9658 4.04869 10.467 4.00049 9.95782 4.00049C5.55715 4.00049 2 7.58792 2 12.0005C2 16.4131 5.55715 20.0005 9.95782 20.0005C10.6438 20.0005 11.3108 19.913 11.948 19.748L11.9443 19.7339C12.6003 19.9078 13.2893 20.0005 14 20.0005C18.4183 20.0005 22 16.4188 22 12.0005C22 7.58221 18.4183 4.00049 14 4.00049C13.2997 4.00049 12.6204 4.09047 11.9731 4.2595ZM14 6.00049C10.6863 6.00049 8 8.68678 8 12.0005C8 15.3142 10.6863 18.0005 14 18.0005C17.3137 18.0005 20 15.3142 20 12.0005C20 8.68678 17.3137 6.00049 14 6.00049Z"
        fill={iconColor}
      />
      <Path
        d="M22 12.0005C22 16.4188 18.4183 20.0005 14 20.0005C9.58172 20.0005 6 16.4188 6 12.0005C6 7.58221 9.58172 4.00049 14 4.00049C18.4183 4.00049 22 7.58221 22 12.0005Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const CreditsAndLoansFilledIcon = assignWithoutSideEffects(
  _CreditsAndLoansFilledIcon,
  {
    componentId: 'CreditsAndLoansFilledIcon',
  }
);

export default CreditsAndLoansFilledIcon;
