/**
 * Generates a map of component's key to name like below 👇
 * {
 *   '042e23e06d6b21818f6ecfa2ef75f8112a5a4d32': 'Modal',
 * }
 */
export const getComponentKeyToNameMap = (node: InstanceNode): Record<string | number, string> => {
  if ((node.mainComponent?.parent as ComponentSetNode)?.key) {
    return {
      [(node.mainComponent?.parent as ComponentSetNode)?.key]: node.name,
    };
  }
  return {
    [node.mainComponent?.key as string | number]: node.name,
  };
};
