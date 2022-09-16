import type { CSSProperties } from 'styled-components';
import { BaseText } from '../BaseText';
import type { BaseTextProps as BaseTextPropsWithChildren } from '../BaseText';
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
    color: 'surface.text.subtle.lowContrast', // update as per type
    fontFamily: 'code', // check fontFamily with saurav
    fontSize: 75,
    as: isPlatformWeb ? 'code' : undefined,
    style: {
      padding: `${codeProps.theme.spacing[1]}px ${codeProps.theme.spacing[3]}px`,
      backgroundColor: codeProps.theme.colors.brand.gray[300],
      borderRadius: `${codeProps.theme.border.radius.medium}px`,
    },
  };

  if (codeProps.variant === 'large') {
    baseTextProps.fontSize = 100;
    (baseTextProps.style as CSSProperties).padding = `0px ${codeProps.theme.spacing[2]}px`;
  }

  return baseTextProps;
};

type CodeProps = {
  children: string;
  variant?: 'large' | 'medium';
  // Add `type`
};

function Code({ children, variant = 'medium' }: CodeProps): JSX.Element {
  const { theme } = useTheme();
  const baseTextProps = getCodeStyles({ variant, theme });
  return <BaseText {...baseTextProps}>{children}</BaseText>; // Use `<Text />` view on React Native
}

export { Code };
