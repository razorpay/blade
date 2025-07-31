const getUserName = (currentProjectRootDirectory: string): string => {
  const userName = currentProjectRootDirectory.split('/')[1];
  return userName;
};

export { getUserName };
