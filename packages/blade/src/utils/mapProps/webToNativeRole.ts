const webToAccessibilityRole = {
  slider: 'adjustable',
  button: 'button',
  heading: 'header',
  img: 'image',
  link: 'link',
  presentation: 'none',
  search: 'search',
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
