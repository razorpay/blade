import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _MagicKonnectFilledIcon: IconComponent = ({
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
        d="M11.7422 2C17.1134 2 21.4843 6.36808 21.4844 11.7393C21.4844 17.1105 17.1134 21.4814 11.7422 21.4814C10.33 21.4814 8.97115 21.1873 7.69629 20.6045L3.05957 21.9834C3.02034 21.9946 2.9777 22 2.93848 22C2.81805 22 2.69743 21.9467 2.61621 21.8486C2.50989 21.7198 2.4909 21.5381 2.56641 21.3896L4.29492 18.0186C2.81271 16.2646 2 14.0454 2 11.7422C2.00002 6.37096 6.37097 2.00002 11.7422 2ZM7.81445 13.71L7 16.6982H11.0332L12.6826 10.6191L7.81445 13.71ZM11.002 9.59961L10.4844 11.4727L13.4463 9.58887L11.5088 16.6963L13.4766 16.6973L16.3379 6.2002L11.002 9.59961Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const MagicKonnectFilledIcon = assignWithoutSideEffects(
  _MagicKonnectFilledIcon,
  {
    componentId: 'MagicKonnectFilledIcon',
  }
);

export default MagicKonnectFilledIcon;
