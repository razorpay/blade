import type { StyledProps } from '../BaseBox/types';
import type { KeysRequired } from '~src/_helpers/types';

/**
 * The input type to these styled-props utilities can be anything as we can just pass all the props and then get the filtered styled-props out of it
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StyledPropsInputType = Record<string, any>;

/**
 * Removing undefined styled-props because when used with spread operator, undefined can override the earlier defined values.

  * Example: the following code will print display: undefined since it is given priority in spread.
  * 
  * ```ts
  * const styledProps = {
  *  display: undefined,
  * }
  *
  * const buttonProps = {
  *  display: 'block',
  * }
  *
  * const styles = {
  *  ...buttonProps,
  *  ...styledProps,
  * } // -> Prints { display: undefined }
  * ```
  */
const removeUndefinedStyledProps = (obj: StyledPropsInputType): StyledPropsInputType => {
  const onlyDefinedStyledProps: StyledProps = {};
  for (const k in obj) {
    if (obj[k as keyof StyledProps] !== undefined) {
      // @ts-expect-error: complex type error
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      onlyDefinedStyledProps[k as keyof StyledProps] = obj[k as keyof StyledProps];
    }
  }
  return onlyDefinedStyledProps;
};

/**
 * - Removes the props that are not styled-props
 * - Returns all the styled props along with undefined values.
 *
 * Can be used in generating storybook docs and testing the possible props.
 *
 *
 * **Use `getStyledProps` instead if you're using this for adding styled-props!**
 */
const filterStyledProps = (props: StyledPropsInputType): KeysRequired<StyledProps> => {
  return {
    alignSelf: props.alignSelf,
    justifySelf: props.justifySelf,
    placeSelf: props.placeSelf,
    order: props.order,
    position: props.position,
    zIndex: props.zIndex,
    gridColumn: props.gridColumn,
    gridColumnStart: props.gridColumnStart,
    gridColumnEnd: props.gridColumnEnd,
    gridRow: props.gridRow,
    gridRowStart: props.gridRowStart,
    gridRowEnd: props.gridRowEnd,
    gridArea: props.gridArea,
    margin: props.margin,
    marginX: props.marginX,
    marginY: props.marginY,
    marginBottom: props.marginBottom,
    marginTop: props.marginTop,
    marginRight: props.marginRight,
    marginLeft: props.marginLeft,
    top: props.top,
    right: props.right,
    bottom: props.bottom,
    left: props.left,
  };
};

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
const getStyledProps = (props: Record<string, any>): StyledProps => {
  return removeUndefinedStyledProps(filterStyledProps(props));
};

export { getStyledProps, filterStyledProps, StyledProps, removeUndefinedStyledProps };
