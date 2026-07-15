import type { MotionMetaProp } from '~components/BaseMotion';
import type { Theme } from '~components/BladeProvider';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { DotNotationToken } from '~utils/lodashButBetter/get';
import type { DataAnalyticsAttribute } from '~utils/types';
import type { BoxProps } from '~components/Box';
import type { BladeFile } from './bladeFile';

type BladeFileList = BladeFile[];

/**
 * Props shared by web and React Native FileUpload.
 *
 * **React Native — not supported:**
 * - `_motionMeta` — motion ref wiring is web-only (attached to the hidden `<input>`)
 * - `data-analytics-*` / `elementtiming` props — on web these are spread onto the hidden file input; not wired on native
 */
type FileUploadCommonProps = {
  /**
   * Position of the label relative to the file upload area. Desktop only prop. Default value on mobile will be 'top'
   *
   * **React Native:** `labelPosition="left"` is silently ignored on native — labels always render above the upload area.
   *
   * @default 'top'
   */
  labelPosition?: 'top' | 'left';
  /**
   * Defines the upload behavior of the FileUpload component
   */
  uploadType?: 'single' | 'multiple';
  /**
   * File types that can be accepted. See [input's accept attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept)
   *
   * Usage: accept=".jpg, .png, .pdf", accept="image/*", accept="image/png, image/jpeg, application/pdf"
   *
   * **React Native:** This prop does not filter files on native. Configure accepted file types
   * directly in your file picker (e.g. `react-native-document-picker`).
   */
  accept?: string;
  /**
   * Disables or enables the FileUpload component
   */
  isDisabled?: boolean;
  /**
   * Sets the required state of the file input
   *
   * @default false
   */
  isRequired?: boolean;
  /**
   * Renders a necessity indicator after the label. If `isRequired` is `true`, it defaults to `'required'`
   */
  necessityIndicator?: 'required' | 'optional' | 'none';
  /**
   * The name of the file upload input, [useful in form submissions](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name)
   */
  name?: string;
  /**
   * List of files that have been selected/uploaded, useful when the component is controlled
   */
  fileList?: BladeFileList;
  /**
   * Limit the number of files that can be uploaded.
   *
   * **React Native:** This prop has no effect on native. Enforce file count limits in the `onChange` callback.
   */
  maxCount?: number;
  /**
   * Limit the size of the uploaded files (in bytes).
   *
   * **React Native:** This prop has no effect on native. Enforce file size limits in the `onChange` callback.
   */
  maxSize?: number;
  /**
   * Callback function triggered when files are selected.
   *
   * **React Native:** This callback fires when the user taps the upload area as a tap signal.
   * `fileList` will always be empty at tap time — open your own file picker
   * (e.g. `react-native-document-picker`) inside this callback and manage the file list yourself.
   *
   * @remarks On React Native, `fileList` is always an empty array in this callback.
   * The type signature is shared with web for cross-platform compatibility, but the semantics
   * differ: on web, `fileList` contains the selected files; on native, it is always `[]`.
   * Prefer `onPress` for native-only tap handling. `onChange` also fires on the same tap
   * (with an empty `fileList`) as a deliberate cross-platform tap signal — do not wire both
   * to the same side effect or the handler will run twice.
   */
  onChange?: ({ name, fileList }: { name?: string; fileList: BladeFileList }) => void;
  /**
   * Callback function triggered when the user taps the upload area (React Native only).
   *
   * Use this callback to open your file picker (e.g. `react-native-document-picker`).
   * On native, `onChange` also fires on the same tap with an empty `fileList` as a
   * cross-platform tap signal. Prefer `onPress` for native-only code so you do not
   * double-handle the tap when both callbacks are provided.
   *
   * This prop has no effect on web.
   */
  onPress?: () => void;
  /**
   * Callback function triggered when the preview icon is clicked
   */
  onPreview?: ({ file }: { file: BladeFile }) => void;
  /**
   * Callback function triggered when a file is removed
   */
  onRemove?: ({ file }: { file: BladeFile }) => void;
  /**
   * Callback function triggered when a file upload is retried
   */
  onReupload?: ({ file }: { file: BladeFile }) => void;
  /**
   * Callback function triggered when a file upload is dismissed
   */
  onDismiss?: ({ file }: { file: BladeFile }) => void;
  /**
   * Callback function executed when files are dropped into the upload area
   *
   * **React Native:** This callback has no effect on native. Drag-and-drop is not supported —
   * use the `onPress` or `onChange` tap signal to open a file picker instead.
   */
  onDrop?: ({ name, fileList }: { name?: string; fileList: BladeFileList }) => void;
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
} & StyledPropsBlade &
  MotionMetaProp;

// Standard size props (medium or large)
type FileUploadStandardSizeProps = FileUploadCommonProps & {
  /**
   * Size of the FileUpload component
   *
   * @default 'medium'
   */
  size?: 'medium' | 'large';
};

// Variable size props with custom text options
type FileUploadVariableSizeProps = FileUploadCommonProps & {
  size: 'variable';
  /**
   * Custom text for the upload action button
   */
  actionButtonText?: string;
  /**
   * Custom text for the drag & drop area
   */
  dropAreaText?: string;
  /**
   * Height of the file upload component
   */
  height?: BoxProps['height'];
  /**
   * Width of the file upload component
   */
  width?: BoxProps['width'];
};

/*
  Mandatory accessibilityLabel prop when label is not provided
*/
type FileUploadPropsWithA11yLabel = {
  /**
   * Label to be shown for the input field
   */
  label?: undefined;
  /**
   * Accessibility label for the input
   */
  accessibilityLabel: string;
};

/*
  Optional accessibilityLabel prop when label is provided
*/
type FileUploadPropsWithLabel = {
  /**
   * Label to be shown for the input field
   */
  label: string;
  /**
   * Accessibility label for the input
   */
  accessibilityLabel?: string;
};

type FileUploadProps = (FileUploadPropsWithA11yLabel | FileUploadPropsWithLabel) &
  (FileUploadStandardSizeProps | FileUploadVariableSizeProps);

type FileUploadItemProps = Pick<
  FileUploadProps,
  'onPreview' | 'onRemove' | 'onDismiss' | 'onReupload' | 'size'
> & {
  file: BladeFile;
  width?: BoxProps['width'];
  minWidth?: BoxProps['minWidth'];
  maxWidth?: BoxProps['maxWidth'];
  flexShrink?: BoxProps['flexShrink'];
  flexGrow?: BoxProps['flexGrow'];
  flexBasis?: BoxProps['flexBasis'];
} & StyledPropsBlade &
  DataAnalyticsAttribute;

type StyledFileUploadWrapperProps = {
  isDisabled?: boolean;
  isActive: boolean;
  size: NonNullable<FileUploadProps['size']>;
  theme: Theme;
  children: React.ReactNode;
};

type StyledFileUploadItemWrapperProps = {
  status: NonNullable<BladeFile['status']>;
  size: NonNullable<FileUploadProps['size']>;
  theme: Theme;
  children: React.ReactNode;
};

type InteractiveBackgroundColors<
  T extends 'gray' | 'negative'
> = `interactive.background.${T}.${DotNotationToken<
  Theme['colors']['interactive']['background'][T]
>}`;

type FileUploadItemBackgroundColors =
  | InteractiveBackgroundColors<'gray'>
  | InteractiveBackgroundColors<'negative'>
  | 'feedback.background.negative.subtle'
  | 'surface.background.gray.intense';

export type {
  BladeFile,
  BladeFileList,
  FileUploadProps,
  FileUploadItemProps,
  StyledFileUploadWrapperProps,
  StyledFileUploadItemWrapperProps,
  FileUploadItemBackgroundColors,
  FileUploadVariableSizeProps,
};
