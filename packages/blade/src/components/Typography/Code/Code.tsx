import type { CSSProperties } from 'styled-components';
import { BaseText } from '../BaseText';
import type { BaseTextProps as BaseTextPropsWithChildren } from '../BaseText';
import type { TextTypes } from '~tokens/theme/theme';
import { useTheme } from '~components/BladeProvider';
import type { ThemeContext } from '~components/BladeProvider/useTheme';
import { getPlatformType } from '~utils';

// @TODO
// - check comments
// - Test on native

type BaseTextProps = Omit<BaseTextPropsWithChildren, 'children'>;
const getCodeStyles = (
  codeProps: Omit<CodeProps, 'children'> & { theme: ThemeContext['theme'] },
): BaseTextProps => {
  const isPlatformWeb = getPlatformType() === 'browser' || getPlatformType() === 'node';

  const baseTextProps: BaseTextProps = {
    color: `surface.text.${codeProps.type ?? 'subtle'}.lowContrast`,
    fontFamily: 'code',
    fontSize: 75,
    as: isPlatformWeb ? 'code' : undefined,
    style: {
      padding: `${codeProps.theme.spacing[1]}px ${codeProps.theme.spacing[3]}px`,
      backgroundColor: codeProps.theme.colors.brand.gray[300],
      borderRadius: `${codeProps.theme.border.radius.medium}px`,
    },
  };

  if (codeProps.size === 'large') {
    baseTextProps.fontSize = 100;
    (baseTextProps.style as CSSProperties).padding = `${codeProps.theme.spacing[0]}px ${codeProps.theme.spacing[2]}px`;
  }

  return baseTextProps;
};

export type CodeProps = {
  children: string;
  size?: 'large' | 'medium';
  type?: TextTypes;
};

function Code({ children, size = 'medium', type = 'subtle' }: CodeProps): JSX.Element {
  const { theme } = useTheme();
  const baseTextProps = getCodeStyles({ theme, size, type });
  return <BaseText {...baseTextProps}>{children}</BaseText>; // Use `<Text />` view on React Native
}

export { Code };
