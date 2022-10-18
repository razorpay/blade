import Box from '~components/Box';
import { BaseText } from '~components/Typography/BaseText';

const SelectorTitle = ({
  children,
  isDisabled,
  size,
}: {
  children: React.ReactNode;
  isDisabled?: boolean;
  size: 'small' | 'medium';
}): React.ReactElement => {
  const isSmall = size === 'small';
  return (
    <>
      <Box marginLeft="spacing.2" />
      <BaseText
        lineHeight={isSmall ? 's' : 'l'}
        fontFamily="text"
        fontWeight="regular"
        fontSize={isSmall ? 75 : 100}
        color={
          isDisabled ? 'surface.text.placeholder.lowContrast' : 'surface.text.subtle.lowContrast'
        }
      >
        {children}
      </BaseText>
    </>
  );
};

export { SelectorTitle };
