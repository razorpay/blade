/**
 * Do you want to define `displayName` or `componentId` on your component? Use this instead to make sure treeshaking doesn't break.
 *
 * ## Usage
 *
 * ### ❌ Incorrect Code (Breaks treeshaking)
 *
 * ```ts
 * const _MyComponent = () => {};
 * const MyComponent = React.forwardRef(_MyComponent);
 * const MyComponent.displayName = 'MyComponent'; // this breaks treeshaking
 *
 * export { MyComponent }
 * ```
 *
 * ### ✅ Correct Code (No Side-Effects. Treeshaking continues to work)
 *
 * ```ts
 * const _MyComponent = () => {};
 * const MyComponentWithRef = React.forwardRef(_MyComponent);
 * const MyComponent = assignWithoutSideEffects(
 *  MyComponentWithRef,
 *  { displayName: 'MyComponent' }
 * );
 *
 * export { MyComponent }
 * ```
 *
 * Checkout other components like [Button.tsx](../../components/Button/Button/Button.tsx), [SelectInput.tsx](../../components/Input/SelectInput/SelectInput.tsx) for example.
 *
 * _Note: You don't have to add PURE comment to this function as it is added during build-time by our `manualPureFunctions` babel plugin_
 */
// We're matching the types of this with Object.assign types
// eslint-disable-next-line @typescript-eslint/ban-types
const assignWithoutSideEffects = <T extends {}>(
  component: T,
  sourceObj: { displayName?: string; componentId?: string },
): T => {
  return /*#__PURE__*/ Object.assign(component, sourceObj);
};

export { assignWithoutSideEffects };
