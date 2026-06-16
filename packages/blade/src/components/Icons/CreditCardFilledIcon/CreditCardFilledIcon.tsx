import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _CreditCardFilledIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.75 4C21.7165 4 22.5 4.7835 22.5 5.75V17.75C22.5 18.7165 21.7165 19.5 20.75 19.5H2.75C1.7835 19.5 1 18.7165 1 17.75V5.75C1 4.7835 1.7835 4 2.75 4H20.75ZM10.625 14.125C10.0727 14.125 9.625 14.5727 9.625 15.125C9.625 15.6773 10.0727 16.125 10.625 16.125H11.75C12.3023 16.125 12.75 15.6773 12.75 15.125C12.75 14.5727 12.3023 14.125 11.75 14.125H10.625ZM15.125 14.125C14.5727 14.125 14.125 14.5727 14.125 15.125C14.125 15.6773 14.5727 16.125 15.125 16.125H18.125C18.6773 16.125 19.125 15.6773 19.125 15.125C19.125 14.5727 18.6773 14.125 18.125 14.125H15.125ZM3 10.125H20.5V8.125H3V10.125Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const CreditCardFilledIcon = assignWithoutSideEffects(_CreditCardFilledIcon, {
  componentId: 'CreditCardFilledIcon',
});

export default CreditCardFilledIcon;
