import type { CSSObject } from 'styled-components';
import { useMemoizedStyles } from '../BaseBox/useMemoizedStyles';
import { getStyledProps } from './getStyledProps';
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
 * import type { StyledProps } from '~src/components/Box/styled-props';
 * import { getStyledProps } from '~src/components/Box/styled-props';
 *
 * type MyComponentProps = {
 *   // ... Your Props
 * } & StyledProps;
 *
 * const MyComponent = (props: MyComponentProps): JSX.Element => {
 *  return (
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
 * import type { StyledProps } from '~src/components/Box/styled-props';
 * import { useStyledProps } from '~src/components/Box/styled-props';
 *
 * type MyTextComponentProps = {
 *   // ... Your Props
 * } & StyledProps;
 *
 *
 * const TextComponentWithStyledProps = styled.p<MyTextComponentProps>((props) => {
 *  const styledPropsCSSObject = useStyledProps(props);
 *
 *  return {
 *    ...styledPropsCSSObject,
 *    // ...your other CSS,
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
  return styledPropsCSSObject;
};

export { useStyledProps };
