import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography/Text';

const SelectorTitle = ({
  children,
  isDisabled,
  size = 'medium',
}: {
  children: React.ReactNode;
  isDisabled?: boolean;
  size: 'small' | 'medium' | 'large';
}): React.ReactElement => {
  return (
    <>
      <BaseBox marginLeft="spacing.2" />
      <Text
        size={size}
        color={isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.subtle'}
      >
        {children}
      </Text>
    </>
  );
};

export { SelectorTitle };
