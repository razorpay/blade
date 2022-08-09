import { BaseText } from '~components/Typography/BaseText';

const SelectorTitle = ({
  children,
  isDisabled,
}: {
  children: React.ReactNode;
  isDisabled?: boolean;
}): React.ReactElement => {
  return (
    <BaseText
      lineHeight="l"
      fontFamily="text"
      fontWeight="regular"
      color={
        isDisabled ? 'surface.text.placeholder.lowContrast' : 'surface.text.subtle.lowContrast'
      }
      fontSize={100}
    >
      {children}
    </BaseText>
  );
};

export { SelectorTitle };
