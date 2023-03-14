import type { CSSObject } from 'styled-components';
import { useMemoizedStyles } from '../BaseBox/useMemoizedStyles';
import { getStyledProps, removeUndefinedStyledProps } from './getStyledProps';
import type { Theme } from '~components/BladeProvider';

/**
 *
 * ## How to add Styled Props to components?
 *
 * There are 2 ways
 * - Using `getStyledProps` + BaseBox wrapper
 * - Using `useStyledProps`
 *
 * You can use `getStyledProps` method if you're fine adding or already have BaseBox wrapper around your component
 * And use `useStyledProps` when adding BaseBox wrapper can cause styling issues or is unneccessary
 *
 * ### Usage
 *
 * #### `getStyledProps` + BaseBox wrapper
 *
 * ```tsx
 * import type { StyledPropsBlade } from '~src/components/Box/styledProps';
 * import { getStyledProps } from '~src/components/Box/styledProps';
 *
 * type MyComponentProps = {
 *   // ... Your Props
 * } & StyledPropsBlade;
 *
 * const MyComponent = (props: MyComponentProps): JSX.Element => {
 *  return (
 *    // Make sure styledProps come last so they take priority in stylings in-case of overrides
 *    <BaseBox {...getStyledProps(props)}>
 *      // Your component code
 *    </BaseBox>
 *  )
 * }
 * ```
 *
 * #### `useStyledProps`
 *
 *
 * ```tsx
 * import type { StyledPropsBlade } from '~src/components/Box/styledProps';
 * import { useStyledProps } from '~src/components/Box/styledProps';
 *
 * type MyTextComponentProps = {
 *   // ... Your Props
 * } & StyledPropsBlade;
 *
 *
 * const TextComponentWithStyledProps = styled.p<MyTextComponentProps>((props) => {
 *  const styledPropsCSSObject = useStyledProps(props);
 *
 *  return {
 *    // ...your other CSS,
 *    ...styledPropsCSSObject, // Make sure styledProps come last so they take priority in styles
 *  }
 * })
 * ```
 *
 * Checkout implementation in `BaseText` components for example of `useStyledProps`
 *
 * - Web: [`BaseText.web.tsx`](../../components/Typography/BaseText/BaseText.web.tsx)
 * - Native: [`BaseText.native.tsx`](../../components/Typography/BaseText/BaseText.native.tsx)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useStyledProps = (props: Record<string, any> & { theme: Theme }): CSSObject => {
  const styledPropsStyles = getStyledProps(props);
  const styledPropsCSSObject = useMemoizedStyles({ ...styledPropsStyles, theme: props.theme });
  const styledPropsWithoutUndefined = removeUndefinedStyledProps(styledPropsCSSObject);
  return styledPropsWithoutUndefined;
};

export { useStyledProps };
