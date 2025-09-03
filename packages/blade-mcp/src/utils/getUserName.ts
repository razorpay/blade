const os = require('os');

const getUserName = (): string => {
  const username = os.userInfo().username;
  return username;
};

export { getUserName };
