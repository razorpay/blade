type Options<T> = {
    skipFetch?: boolean;
    onSuccess?: (result: T) => void;
    onError?: (error: unknown) => void;
};
declare const useEarlyFetch: <T>(fetchFn: () => Promise<T>, initialData?: T | null, options?: Options<T>) => {
    data: T | null;
    isLoading: boolean;
    error: unknown;
    refetch: () => Promise<T>;
};
export default useEarlyFetch;
