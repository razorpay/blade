const getUserName = (currentProjectRootDirectory: string): string => {
  const userName = currentProjectRootDirectory?.split('/')?.[2] ?? 'unknown';
  return userName;
};

export { getUserName };
