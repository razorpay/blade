import { BaseText } from '~components/Typography/BaseText';

const CheckboxLabelText = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <BaseText
      lineHeight="l"
      fontFamily="text"
      fontWeight="regular"
      color="surface.text.subtle.lowContrast"
      fontSize={100}
    >
      {children}
    </BaseText>
  );
};

export { CheckboxLabelText };
