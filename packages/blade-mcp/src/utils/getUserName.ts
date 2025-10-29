const getUserName = (): string => {
  // Extract username from file path (e.g., /Users/username/...)
  const currentPath = process.cwd();
  const pathParts = currentPath.split('/');

  // Find the 'Users' directory and get the next part (username)
  const usersIndex = pathParts.indexOf('Users');
  if (usersIndex !== -1 && pathParts[usersIndex + 1]) {
    return pathParts[usersIndex + 1];
  }

  // Fallback: try to extract from any path structure
  // Look for common patterns like /home/username or /Users/username
  for (let i = 0; i < pathParts.length; i++) {
    if (pathParts[i] === 'Users' || pathParts[i] === 'home') {
      if (pathParts[i + 1] && pathParts[i + 1] !== 'Desktop' && pathParts[i + 1] !== 'Documents') {
        return pathParts[i + 1];
      }
    }
  }

  // Final fallback: return the first non-empty part after root
  return pathParts.find((part) => part && part !== '') ?? 'unknown';
};

export { getUserName };
