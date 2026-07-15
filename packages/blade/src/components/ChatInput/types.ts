import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { BladeFile, BladeFileList } from '~components/FileUpload/types';
import type { FormInputOnEvent } from '~components/Form/FormTypes';

type ChatInputProps = {
  /**
   * Controlled value of the text input
   */
  value?: string;

  /**
   * Default value of the text input for uncontrolled usage
   */
  defaultValue?: string;

  /**
   * Callback fired when the text input value changes
   */
  onChange?: ({ value }: { value: string }) => void;

  /**
   * Callback fired when the text input receives focus
   */
  onFocus?: FormInputOnEvent;

  /**
   * Callback fired when the text input loses focus
   */
  onBlur?: FormInputOnEvent;

  /**
   * Callback fired when the user submits the input.
   * Receives the current text value and the list of attached files.
   *
   * **Note (Web):** Triggered by the submit button or by pressing Enter (Shift+Enter inserts a newline).
   *
   * **Note (React Native):** Triggered by the submit button only. The return key inserts a newline
   * (standard mobile chat behavior), so there is no Enter-to-submit on native.
   */
  onSubmit?: ({ value, fileList }: { value: string; fileList: BladeFileList }) => void;

  /**
   * Placeholder text shown when the input is empty
   */
  placeholder?: string;

  /**
   * Disables the text input, file upload button, and submit button
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Whether the AI is currently generating a response.
   * When true, the submit button changes to a stop button.
   * @default false
   */
  isGenerating?: boolean;

  /**
   * Callback fired when the user clicks the stop button (visible when isGenerating is true).
   * Use this to cancel an in-flight AI generation.
   */
  onStop?: () => void;

  /**
   * List of attached files. Used for controlled file management.
   * Reuses the BladeFile/BladeFileList types from the FileUpload component.
   */
  fileList?: BladeFileList;

  /**
   * Callback fired when files are selected via the upload button.
   *
   * ⚠️ **Platform behavior differs:** the callback's timing and the contents of `fileList`
   * are not the same on Web and React Native — read both notes before wiring a shared handler.
   *
   * **Note (Web):** Called after files are picked, with `fileList` containing the merged list of
   * previously attached files plus the newly selected files.
   *
   * **Note (React Native):** Called when the upload button is tapped (before any file is picked).
   * `fileList` contains the current list of already-attached files, not newly picked ones.
   * Wire your own file picker (e.g. `react-native-document-picker`) and update the `fileList` prop
   * after the user selects files.
   */
  onFileChange?: ({ fileList }: { fileList: BladeFileList }) => void;

  /**
   * Callback fired when a file is removed (trash icon on a success-status file).
   *
   * Files without an `id` are assigned one when the list is applied (same as web pick/paste),
   * so remove/dismiss filtering stays stable for document-picker results that omit `id`.
   */
  onFileRemove?: ({ file }: { file: BladeFile }) => void;

  /**
   * Callback fired when the dismiss (✕) button is clicked on an uploading-status file.
   * Use this to cancel an in-flight upload request.
   */
  onFileDismiss?: ({ file }: { file: BladeFile }) => void;

  /**
   * Callback fired when the re-upload button is clicked on a file with error status
   */
  onFileReupload?: ({ file }: { file: BladeFile }) => void;

  /**
   * File types that can be accepted. Follows the HTML input accept attribute format.
   * @example ".jpg,.png,.pdf" or "image/*"
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept
   *
   * ⚠️ **Platform behavior differs:** the `accept` prop only works on Web. On React Native it has
   * no effect — file filtering should be handled by your file picker (see `onFileChange`).
   *
   * **Note (React Native):** No effect. File filtering is not handled by ChatInput on native since
   * consumers wire their own file picker (see `onFileChange`) and are responsible for filtering.
   */
  accept?: string;

  /**
   * List of ghost suggestions displayed as faded text in the input.
   * When multiple suggestions are provided, they cycle automatically with a crossfade animation.
   * The user can press TAB to accept the currently visible suggestion.
   *
   * **Note (React Native):** No effect. Ghost suggestions are a web-only feature.
   */
  suggestions?: string[];

  /**
   * Callback fired when the user accepts the currently visible ghost suggestion (via TAB key).
   *
   * **Note (React Native):** No effect. Ghost suggestions are a web-only feature.
   */
  onSuggestionAccept?: ({ suggestion }: { suggestion: string }) => void;

  /**
   * Indicates the validation state of the input.
   * When set to 'error', errorText is displayed below the input as an animated popup sliding from behind the card.
   * @default 'none'
   */
  validationState?: 'error' | 'none';

  /**
   * Error message displayed below the input when validationState is 'error'.
   */
  errorText?: string;

  /**
   * Callback fired when the user dismisses the error popup by clicking the close button.
   */
  onErrorDismiss?: () => void;

  /**
   * Hides the file upload button in the action bar.
   * @default false
   */
  hideFileUpload?: boolean;

  /**
   * When true, the input is automatically focused on mount.
   * @default false
   */
  autoFocus?: boolean;

  /**
   * Accessibility label for the input. Required when no visible label is present.
   */
  accessibilityLabel?: string;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

export type { ChatInputProps };
