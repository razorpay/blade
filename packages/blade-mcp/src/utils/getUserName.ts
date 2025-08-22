const getUserName = (currentProjectRootDirectory: string): string => {
  const userName = currentProjectRootDirectory?.split('/')?.[1] ?? 'unknown';
  return userName;
};

export { getUserName };
