import { BaseText } from '~components/Typography/BaseText';
import { getPlatformType } from '~utils';

const SelectorSupportText = ({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}): React.ReactElement => {
  const isReactNative = getPlatformType() === 'react-native';

  return (
    <BaseText
      id={id}
      as={isReactNative ? undefined : 'span'}
      color="surface.text.muted.lowContrast"
      fontSize={50}
      lineHeight={100}
      fontStyle="italic"
      fontFamily="text"
    >
      {children}
    </BaseText>
  );
};

export { SelectorSupportText };
