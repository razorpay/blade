// Web keeps BladeFile structurally compatible with the DOM `File`/`Blob` API so that
// consumers can keep passing it to `FormData.append`, `URL.createObjectURL`, etc.
interface BladeFile extends File {
  /**
   * The unique identifier of the file.
   */
  id?: string;
  /**
   * The file's upload status.
   */
  status?: 'uploading' | 'success' | 'error';
  /**
   * The percentage of file upload completion.
   */
  uploadPercent?: number;
  /**
   * Text indicating an error state
   */
  errorText?: string;
}

export type { BladeFile };
