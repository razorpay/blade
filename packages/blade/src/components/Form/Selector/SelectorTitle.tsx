import BaseBox from '~components/Box/BaseBox';
import { BaseText } from '~components/Typography/BaseText';

const SelectorTitle = ({
  children,
  isDisabled,
  size = 'medium',
}: {
  children: React.ReactNode;
  isDisabled?: boolean;
  size: 'small' | 'medium';
}): React.ReactElement => {
  const lineHeight = {
    small: 50,
    medium: 100,
  } as const;
  const fontSize = {
    small: 75,
    medium: 100,
  } as const;

  return (
    <>
      <BaseBox marginLeft="spacing.2" />
      <BaseText
        lineHeight={lineHeight[size]}
        fontFamily="text"
        fontWeight="regular"
        fontSize={fontSize[size]}
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
