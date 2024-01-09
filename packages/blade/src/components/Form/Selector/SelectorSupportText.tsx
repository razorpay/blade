import { Box } from '~components/Box';
import { Text } from '~components/Typography/Text';
import { castWebType, getPlatformType } from '~utils';

const SelectorSupportText = ({
  children,
  id,
  isNegative,
}: {
  children: React.ReactNode;
  id?: string;
  isNegative?: boolean;
}): React.ReactElement => {
  const isReactNative = getPlatformType() === 'react-native';

  return (
    <Box id={id} display={isReactNative ? undefined : castWebType('contents')}>
      <Text
        variant="caption"
        size="small"
        as={isReactNative ? undefined : 'span'}
        color={isNegative ? 'feedback.text.negative.intense' : 'surface.text.gray.muted'}
      >
        {children}
      </Text>
    </Box>
  );
};

export { SelectorSupportText };
