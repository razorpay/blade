import type { StyledPropsBlade } from '../BaseBox/types';
import type { KeysRequired } from '~utils/types';

/**
 * The input type to these styledProps utilities can be anything as we can just pass all the props and then get the filtered styledProps out of it
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StyledPropsInputType = Record<string, any>;

/**
 * Removing undefined styledProps because when used with spread operator, undefined can override the earlier defined values.

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
  const onlyDefinedStyledProps: StyledPropsBlade = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
      // @ts-ignore: complex type error
      onlyDefinedStyledProps[key] = obj[key];
    }
  }
  return onlyDefinedStyledProps;
};

/**
 * - Removes the props that are not styledProps
 * - Returns all the styled props along with undefined values.
 *
 * Can be used in generating storybook docs and testing the possible props.
 *
 *
 * **Use `getStyledProps` instead if you're using this for adding styledProps!**
 */
const makeStyledProps = (props: StyledPropsInputType): KeysRequired<StyledPropsBlade> => {
  return {
    alignSelf: props.alignSelf,
    display: props.display,
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
    visibility: props.visibility,
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
 * And use `useStyledProps` when adding BaseBox wrapper can cause styling issues or is unneccessary and you want to prevent unnecessary renders
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
 * const MyComponent = (props: MyComponentProps): React.ReactElement => {
 *  return (
 *    // Make sure styledProps come last so they take priority in stylings in-case of overrides
 *    <BaseBox someOtherProp={someValue} {...getStyledProps(props)}>
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
const getStyledProps = (props: Record<string, any>): StyledPropsBlade => {
  return removeUndefinedStyledProps(makeStyledProps(props));
};

export type { StyledPropsBlade };
export { getStyledProps, makeStyledProps, removeUndefinedStyledProps };
