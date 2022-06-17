const webToAccessibilityRole = {
  slider: 'adjustable',
  heading: 'header',
  img: 'image',
  presentation: 'none',
  region: 'summary',
  imagebutton: null,
  keyboardkey: null,
  label: null,
  text: null,
};

const webToNativeRole = (role: keyof typeof webToAccessibilityRole): string => {
  if (role) {
    const inferredRole = webToAccessibilityRole[role];
    if (inferredRole !== null) {
      // ignore roles that don't map to web
      return inferredRole || role;
    }
  }
  return role;
};

export default webToNativeRole;
