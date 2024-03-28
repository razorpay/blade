import { Box } from '~components/Box';
import { Text } from '~components/Typography/Text';
import { castWebType, getPlatformType } from '~utils';

const SelectorSupportText = ({
  children,
  id,
  isNegative,
  size,
}: {
  children: React.ReactNode;
  id?: string;
  isNegative?: boolean;
  size: 'small' | 'medium' | 'large';
}): React.ReactElement => {
  const isReactNative = getPlatformType() === 'react-native';
  const sizeMapping = {
    small: 'small',
    medium: 'small',
    large: 'medium',
  } as const;

  return (
    <Box id={id} display={isReactNative ? undefined : castWebType('contents')}>
      <Text
        variant="caption"
        size={sizeMapping[size]}
        as={isReactNative ? undefined : 'span'}
        color={isNegative ? 'feedback.text.negative.intense' : 'surface.text.gray.muted'}
      >
        {children}
      </Text>
    </Box>
  );
};

export { SelectorSupportText };
