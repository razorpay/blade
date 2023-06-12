import { useEffect, useMemo, useState } from 'react';

export function useMediaQuery(mediaQuery: string): boolean {
  const query = useMemo(() => window.matchMedia(mediaQuery), [mediaQuery]);
  console.log('query results', query);
  const [matches, setMatches] = useState(query.matches);
  useEffect(() => {
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  }, [query]);
  return matches;
}
