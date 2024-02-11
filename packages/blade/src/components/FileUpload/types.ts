import type { Theme } from '~components/BladeProvider';

interface BladeFile extends File {
  /**
   * The unique identifier of the file.
   */
  id: string;
  /**
   * The file's upload status.
   */
  status?: 'uploading' | 'success' | 'error';
  /**
   * The percentage of file upload completion.
   */
  percent?: number;
  /**
   * Text indicating an error state
   */
  errorText?: string;
}

type BladeFileList = BladeFile[];

type FileUploadProps = {
  /**
   * Label for the FileUpload component
   */
  label?: string;
  /**
   * Accessibility label for the FileUpload component, required if label is not provided
   */
  accessibilityLabel?: string;
  /**
   * Position of the label relative to the file upload area. Desktop only prop. Default value on mobile will be 'top'
   */
  labelPosition?: 'top' | 'left';
  /**
   * Defines the selection behavior of the FileUpload component
   */
  selectionType?: 'single' | 'multiple';
  /**
   * File types that can be accepted. See [input's accept attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept)
   *
   * Usage: accept=".jpg, .png, .pdf", accept="image/*", accept="image/png, image/jpeg, application/pdf"
   */
  accept?: string;
  /**
   * Disables or enables the FileUpload component
   */
  isDisabled?: boolean;
  /**
   * The name of the file upload input, [useful in form submissions](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name)
   */
  name?: string;
  /**
   * Default list of files that have been uploaded, useful when the component is uncontrolled
   */
  defaultFileList?: BladeFileList;
  /**
   * List of files that have been selected/uploaded, useful when the component is controlled
   */
  fileList?: BladeFileList;
  /**
   * Limit the number of files that can be uploaded
   */
  maxCount?: number;
  /**
   * Limit the size of the uploaded files (in bytes)
   */
  maxSize?: number;
  /**
   * Callback function triggered when files are selected
   */
  onChange?: ({ name, fileList }: { name: string; fileList: BladeFileList }) => void;
  /**
   * Callback function triggered when the preview icon is clicked
   */
  onPreview?: ({ previewedFile }: { previewedFile: File }) => void;
  /**
   * Callback function triggered when a file is removed
   */
  onRemove?: ({ removedFile }: { removedFile: File }) => void;
  /**
   * Callback function executed when files are dropped into the upload area
   */
  onDrop?: (event: React.DragEvent) => void;
  /**
   * State indicating whether there is an error in the FileUpload component
   */
  validationState?: 'none' | 'error';
  /**
   * Additional text providing assistance or guidance
   */
  helpText?: string;
  /**
   * Text indicating an error state
   */
  errorText?: string;
  /**
   * Test ID for automation
   */
  testID?: string;
};

type FileUploadItemProps = Pick<FileUploadProps, 'onPreview' | 'onRemove'> & {
  file: BladeFile;
};

type StyledFileUploadWrapperProps = {
  isDisabled?: boolean;
  theme: Theme;
  children: React.ReactNode;
};

export type {
  BladeFile,
  BladeFileList,
  FileUploadProps,
  FileUploadItemProps,
  StyledFileUploadWrapperProps,
};
