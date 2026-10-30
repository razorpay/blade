import type React from 'react';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { BladeFile, BladeFileList } from '~components/FileUpload/types';
import type { FormInputOnEvent } from '~components/Form/FormTypes';
import type { MenuOverlayProps } from '~components/Menu';

type ChatInputStatus = 'ready' | 'submitted' | 'streaming' | 'error';

type ChatInputCommand = {
  /**
   * Value passed to `onCommandSelect`, such as `refund`. Typing `/` followed by the start of the
   * value or label filters the list.
   */
  value: string;
  /**
   * Text shown in the list, such as `/refund`
   */
  label: string;
  /**
   * Optional second line, such as "Refund a payment, in full or in part"
   */
  description?: string;
};

type ChatInputFileError = {
  /**
   * Why the file was not added:
   * - `maxCount`: adding it would go over `maxCount`
   * - `maxSize`: it is larger than `maxSize`
   * - `accept`: its type is not in `accept`
   */
  code: 'maxCount' | 'maxSize' | 'accept';
  /**
   * A message that can be shown as is, such as "invoice.pdf is larger than 10 MB"
   */
  message: string;
  /**
   * The file that was not added
   */
  file: BladeFile;
};

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
   *
   * ChatInput does not clear the box on its own. Set `clearOnSubmit` to have it clear what was
   * sent once the promise you return resolves.
   */
  onSubmit?: ({
    value,
    fileList,
  }: {
    value: string;
    fileList: BladeFileList;
  }) => void | Promise<unknown>;

  /**
   * Clears what was sent once the promise returned by `onSubmit` resolves. If it rejects,
   * everything is kept so the send can be retried.
   *
   * Only the parts ChatInput owns are cleared: the text when there is no `value` prop, and the
   * files when there is no `fileList` prop. Controlled values stay in your hands. Text typed or
   * files added while the request was in flight are kept. Has no effect when `onSubmit` does not
   * return a promise.
   * @default false
   */
  clearOnSubmit?: boolean;

  /**
   * Placeholder text shown when the input is empty
   */
  placeholder?: string;

  /**
   * Size of the chat input.
   *
   * - `medium`: the text sits above a toolbar with the "+" on the left and Send on the right.
   * - `small`: a compact, one-row composer. The "+" and Send sit inline with the text. Once the
   *   text needs a second line, it opens into the `medium` layout, and closes back to one row when
   *   the text is cleared.
   *
   * **Note (React Native):** `small` stays one row with the "+" and Send inline, and the text area
   * grows upwards as you type. It does not switch to the `medium` layout.
   * @default 'medium'
   */
  size?: 'small' | 'medium';

  /**
   * State of the current request, which decides what the submit button shows:
   * - `ready`: Send, once there is text or a file to send
   * - `submitted`: a loader, while the request is on its way
   * - `streaming`: Stop, while the reply streams (calls `onStop`)
   * - `error`: Retry, after the request failed (calls `onSubmit` again). This is about the
   *   request; `validationState="error"` is about what the person typed or attached.
   *
   * `submitted` and `streaming` match the status names used by the Vercel AI SDK, so its `status`
   * can be passed straight through. When `status` and the deprecated `isGenerating` are both set,
   * `status` wins.
   * While `submitted`, Enter does not send again. While `streaming`, Enter still calls `onSubmit`,
   * so the product can queue the next message or ignore it.
   * @default 'ready'
   */
  status?: ChatInputStatus;

  /**
   * Content above the text, such as context chips (Blade `Tag`s) for the payment, order or report
   * the message is about.
   */
  header?: React.ReactNode;

  /**
   * A Blade `MenuOverlay` that the "+" button opens, such as "Upload files" and "Add a payment".
   * Without it, the "+" button opens the file picker.
   *
   * Pass a function to get `openFilePicker`, so a menu item can open ChatInput's own file picker:
   * `actionMenu={({ openFilePicker }) => <MenuOverlay><MenuItem title="Upload files" onClick={openFilePicker} /></MenuOverlay>}`.
   * With `actionMenu`, the "+" shows even when `hideFileUpload` is set, because it opens the menu.
   *
   * **Note (React Native):** No effect. The "+" button calls `onFileChange`, as before.
   */
  actionMenu?:
    | React.ReactElement<MenuOverlayProps>
    | ((helpers: { openFilePicker: () => void }) => React.ReactElement<MenuOverlayProps>);

  /**
   * Slash commands. Typing `/` at the start of the text opens a list of these above the input,
   * filtered by what follows the slash. Arrow keys move, Enter picks, and Escape or Tab closes it
   * (Tab then moves focus on as usual). The text box points at the list with `aria-haspopup`,
   * `aria-controls` and `aria-activedescendant`.
   *
   * **Note (React Native):** No effect.
   */
  commands?: ChatInputCommand[];

  /**
   * Called when a command is picked from the slash command list. ChatInput clears the `/...` text.
   *
   * **Note (React Native):** No effect.
   */
  onCommandSelect?: ({ value }: { value: string }) => void;

  /**
   * Most files that can be attached in total, as in `FileUpload`. Files over the limit are not
   * added, and
   * `onFileError` is called with `code: 'maxCount'`.
   *
   * **Note (React Native):** No effect. Limit files in your own file picker.
   */
  maxCount?: number;

  /**
   * Largest file size allowed, in bytes. Larger files are not added, and `onFileError` is called
   * with `code: 'maxSize'`.
   *
   * These checks only guide people in the browser. Your server must still check every file.
   *
   * **Note (React Native):** No effect. Limit files in your own file picker.
   */
  maxSize?: number;

  /**
   * Called for each file that is not added, because of `maxCount`, `maxSize` or `accept`.
   * It is called after `onFileChange` for the files that were added from the same batch.
   *
   * **Note (React Native):** No effect.
   */
  onFileError?: (error: ChatInputFileError) => void;

  /**
   * Where files can be dropped.
   * - `input`: on the chat input only
   * - `page`: anywhere on the page, for full-page chat screens
   * - `none`: dropping is off, for example when the page has its own drop zone
   *
   * Dropping and pasting files are also off when `hideFileUpload` is set without an `actionMenu`,
   * since there is then no way to attach files.
   * @default 'input'
   *
   * **Note (React Native):** No effect.
   */
  dropTarget?: 'input' | 'page' | 'none';

  /**
   * Shows the ambient border: a soft blue border with a brighter streak that travels slowly around
   * the box, about once every 12 seconds. While the cursor is in the box, the border is full blue
   * and the streak becomes a soft white shine. It is decoration and does not mean the agent is
   * working. With reduced motion nothing moves; `validationState="error"`, `status="error"` and
   * `isDisabled` turn it off.
   *
   * **Note (React Native):** Shows the plain borders.
   * @default false
   */
  showAmbientBorder?: boolean;

  /**
   * Disables the text input, file upload button, and submit button
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Whether the AI is currently generating a response.
   * When true, the submit button changes to a stop button.
   * @deprecated Use `status="streaming"` instead. This prop will be removed in a future major
   * version. When both are set, `status` wins.
   * @default false
   */
  isGenerating?: boolean;

  /**
   * Callback fired when the user clicks the stop button (visible when `status="streaming"`).
   * Use this to cancel an in-flight AI generation. Without it the Stop button does nothing, and
   * Blade warns in development.
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
   * Hides the "+" button that opens the file picker. When `actionMenu` is set, the "+" still shows
   * and opens the menu. Without an `actionMenu`, dropping and pasting files are off too.
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

export type { ChatInputProps, ChatInputStatus, ChatInputCommand, ChatInputFileError };
