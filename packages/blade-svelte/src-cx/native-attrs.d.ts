/**
 * Attributes read only by the native renderer (packages/native). On web they
 * are inert unknown attributes; declaring them keeps the shared anatomies
 * free of platform branches.
 */
declare namespace svelteHTML {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HTMLAttributes<T> {
    /** 'next': the platform focuses the next input when this one fills. */
    advance?: string;
    /** Serialized FormatSpec: the platform formats in its own text pass. */
    format?: string;
  }
}
