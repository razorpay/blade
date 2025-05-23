import { useState, useEffect } from 'react';

type Options<T> = {
  skipFetch?: boolean;
  onSuccess?: (result: T) => void;
  onError?: (error: unknown) => void;
};

const useEarlyFetch = <T>(
  fetchFn: () => Promise<T>,
  initialData: T | null = null,
  options: Options<T> = {},
): { data: T | null; isLoading: boolean; error: unknown; refetch: () => Promise<T> } => {
  const { skipFetch = false, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [isLoading, setIsLoading] = useState(!skipFetch);
  const [error, setError] = useState<unknown>(null);

  const fetchPromise = skipFetch ? null : fetchFn();

  useEffect(() => {
    let isMounted = true;

    if (!fetchPromise) {
      setIsLoading(false);
      return;
    }

    fetchPromise
      .then((result) => {
        if (isMounted) {
          setData(result);
          setIsLoading(false);
          onSuccess?.(result);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setIsLoading(false);
          onError?.(err);
        }
      });

    // eslint-disable-next-line consistent-return
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPromise]);

  const refetch = (): Promise<T> => {
    setIsLoading(true);
    setError(null);

    return fetchFn()
      .then((result) => {
        setData(result);
        setIsLoading(false);
        onSuccess?.(result);
        return result;
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
        onError?.(err);
        throw err;
      });
  };

  return { data, isLoading, error, refetch };
};

export default useEarlyFetch;
