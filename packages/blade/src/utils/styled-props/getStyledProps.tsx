import type { StyledProps } from '../../components/Box/BaseBox/types';

/**
 * This utility takes all your props and returns only the styled props that are to be used on components
 *
 * ### Usage
 *
 * ```tsx
 * import type { StyledProps } from '~utils';
 * import { getStyledProps } from '~utils';
 *
 * const MyComponent = (props: MyComponentProps & StyledProps) => {
 *  return (
 *    <BaseBox {...getStyledProps(props)}>
 *      // Your component code
 *    </BaseBox>
 *  )
 * }
 * ```
 *
 *
 * Or if you don't want to wrap component in BaseBox, checkout [useStyledProps](./useStyledProps.web.tsx)
 *
 * ```tsx
 * import { useStyledProps } from '~utils';
 *
 * const TextComponentWithStyledProps = styled.p((props) => {
 *  const styledPropsCSSObject = useStyledProps(props)
 *
 *  return {
 *    ...styledPropsCSSObject,
 *    ...your other CSS,
 *  }
 * })
 * ```
 *
 * Checkout implementation in `BaseText` components for more details
 *
 * - Web: [`BaseText.web.tsx`](../../components/Typography/BaseText/BaseText.web.tsx)
 * - Native: [`BaseText.native.tsx`](../../components/Typography/BaseText/BaseText.native.tsx)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getStyledProps = (props: Record<string, any>): StyledProps => {
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

export { getStyledProps, StyledProps };
