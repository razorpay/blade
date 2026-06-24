const getInitials = (name: string): string => {
  const names = name.trim().toUpperCase().split(' ');
  if (names.length === 1) return names[0].substring(0, 2);
  return names[0][0] + names[names.length - 1][0];
};

export { getInitials };
