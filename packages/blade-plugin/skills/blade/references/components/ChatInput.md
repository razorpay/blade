# ChatInput

## Description

`ChatInput` is the message box for AI chat interfaces. It combines a growing textarea, a "+" button for files (or a `MenuOverlay` of actions via `actionMenu`), attachment previews, context chips above the text (`header`), slash commands (`commands`), ghost suggestion autocomplete (cycling suggestions accepted with Tab) and a Send button that appears once there is something to send. `status` decides what that button shows: Send, a loader, Stop or Retry. It comes in two sizes: `medium`, with the text above a toolbar, and a compact `small` that starts as one row and opens into the full layout once the text wraps. File limits (`accept`, `maxCount`, `maxSize`, `onFileError`) apply to picked, pasted and dropped files, and files can be dropped on the input or anywhere on the page, or not at all (`dropTarget`). `showAmbientBorder` adds a slow, decorative blue border. It supports controlled and uncontrolled text, a validation error popup, and `clearOnSubmit`, which clears the box once the promise returned by `onSubmit` resolves.

## Important Constraints

- `suggestions` and `onSuggestionAccept` must be used together — providing `suggestions` without `onSuggestionAccept` means accepted suggestions are not propagated back to state.
- Most functionality of ChatInput is always controlled on consumer.
- File checks (`accept`, `maxCount`, `maxSize`) only guide people in the browser. The server must still check every uploaded file's name, type and size.
- `actionMenu`, `commands`, `onCommandSelect`, `maxCount`, `maxSize`, `onFileError` and `dropTarget` are web only. On React Native they have no effect, and `showAmbientBorder` shows the plain borders.
- Send is hidden (not disabled) while there is no text and no file.

## TypeScript Types

These are the props accepted by `ChatInput` and the related types it depends on.

```typescript
// BladeFile: the native File with upload state fields
interface BladeFile extends File {
  /** Unique identifier for the file */
  id?: string;
  /** Upload status of the file */
  status?: 'uploading' | 'success' | 'error';
  /** Upload completion percentage */
  uploadPercent?: number;
  /** Error text when status is 'error' */
  errorText?: string;
}

// BladeFileList: an array of BladeFile objects
type BladeFileList = BladeFile[];

// FormInputOnEvent: the focus and blur callback shared by Blade inputs
type FormInputOnEvent = ({
  name,
  value,
  rawValue,
}: {
  name?: string;
  value?: string;
  rawValue?: string;
}) => void;

// MenuOverlayProps: the props of Blade's MenuOverlay (see the Menu doc)
type MenuOverlayProps = {
  children: React.ReactNode;
  zIndex?: number;
  width?: string;
};

type ChatInputStatus = 'ready' | 'submitted' | 'streaming' | 'error';

type ChatInputCommand = {
  /**
   * Value passed to `onCommandSelect`, such as `refund`. Typing `/` followed by the start of the
   * value or title filters the list.
   */
  value: string;
  /**
   * The command's name without the slash, such as `refund`. ChatInput shows it as `/refund`, so
   * every product renders commands the same way. Named `title` to match `ActionListItem` and
   * `MenuItem`.
   */
  title: string;
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
   * ChatInput does not clear the box on its own. Set `clearOnSubmit` and return a promise (an
   * `async` handler works as is) to have it clear what was sent once that promise resolves. The
   * return type stays `void` so every handler that compiled before still does.
   */
  onSubmit?: ({ value, fileList }: { value: string; fileList: BladeFileList }) => void;

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
   * Dropping is also off when `hideFileUpload` is set without an `actionMenu`, since there is then
   * no visible way to attach files. Pasting files works as before.
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
   * Use this to cancel an in-flight AI generation. Without it the Stop button is disabled, and
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
   * and opens the menu. Without an `actionMenu`, dropping files is off too; pasting still works.
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
```

## Usage Guidelines

**Do**

- Use `ChatInput` for AI chat interfaces and conversational UIs.
- Use `status` (`ready`, `submitted`, `streaming`, `error`) to follow the request: Send, a loader, Stop or Retry. `isGenerating` is deprecated: use `status="streaming"`, and pass `onStop` so Stop works.
- Set `clearOnSubmit` and return a promise from `onSubmit` to let ChatInput clear the box when the send succeeds and keep it when it fails. With a controlled `value` or `fileList`, clear them yourself.
- Use `size="small"` where height is tight, such as a chat panel on a phone. Keep its placeholder to about 25 characters.
- Use `header` for removable context `Tag`s, such as the payment or report the message is about.
- Use `actionMenu` with a `MenuOverlay` when the "+" should offer more than file upload.
- Use `commands` with `onCommandSelect` for slash commands.
- Use `maxCount`, `maxSize` and `onFileError` to explain why a file was not attached.
- Use `dropTarget="page"` on full-page chat screens.
- Use `suggestions` with `onSuggestionAccept` to show cycling ghost suggestions that people accept with Tab.

**Don't**

- Don't use `ChatInput` for simple forms or single-line input; use `TextInput` or `TextArea`.
- Don't rely on the file limits for security; validate files on the server too.
- Don't use `showAmbientBorder` to mean "the agent is working"; it is decoration. Use `status` for progress.
- Don't use `suggestions` without `onSuggestionAccept`.
- Don't expect automatic file uploads; the consumer manages the upload lifecycle and status.

## Examples

### Basic Chat Input with File Upload

Enable file upload by providing `fileList`, `onFileChange`, and `onFileRemove`. Restrict accepted file types with `accept`. Users can also paste images directly into the input when `accept` includes image types.

```tsx
import { useState } from 'react';
import { ChatInput } from '@razorpay/blade/components';
import type { BladeFileList, BladeFile } from '@razorpay/blade/components';

function ChatInputWithFileUpload() {
  const [value, setValue] = useState('');
  const [files, setFiles] = useState<BladeFileList>([]);

  return (
    <ChatInput
      value={value}
      onChange={({ value }) => setValue(value)}
      placeholder="Ask a question or attach a file..."
      fileList={files}
      onFileChange={({ fileList }) => setFiles(fileList)}
      onFileRemove={({ file }) => setFiles((prev) => prev.filter((f) => f.id !== file.id))}
      accept=".jpg,.png,.pdf,.xlsx"
      onSubmit={({ value, fileList }) => {
        console.log('Submitted:', value, 'Files:', fileList);
        setValue('');
        setFiles([]);
      }}
      accessibilityLabel="Chat input with file upload"
    />
  );
}
```

### Stop Generation

Set `isGenerating={true}` while waiting for an AI response. The submit button becomes a stop button. Call `onStop` to cancel and reset the generating state.

```tsx
import { useState, useRef } from 'react';
import { ChatInput } from '@razorpay/blade/components';

function ChatInputWithStopGeneration() {
  const [value, setValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  return (
    <ChatInput
      value={value}
      onChange={({ value }) => setValue(value)}
      placeholder="Ask a question..."
      isGenerating={isGenerating}
      onSubmit={({ value }) => {
        const controller = new AbortController();
        abortRef.current = controller;
        setIsGenerating(true);
        setValue('');
        // Simulate AI response
        setTimeout(() => setIsGenerating(false), 5000);
      }}
      onStop={() => {
        abortRef.current?.abort();
        setIsGenerating(false);
      }}
      accessibilityLabel="Chat input with stop generation"
    />
  );
}
```

### Error Handling

Set `validationState="error"` with an `errorText` to show an animated error popup that slides out from behind the input card. Provide `onErrorDismiss` to render a dismiss button inside the popup.

```tsx
import { useState } from 'react';
import { ChatInput } from '@razorpay/blade/components';

function ChatInputWithValidation() {
  const [value, setValue] = useState('');
  const [validationState, setValidationState] = useState<'error' | 'none'>('none');
  const [errorText, setErrorText] = useState('');

  return (
    <ChatInput
      value={value}
      onChange={({ value }) => setValue(value)}
      placeholder="Ask a question..."
      validationState={validationState}
      errorText={errorText}
      onErrorDismiss={() => setValidationState('none')}
      onSubmit={({ value }) => {
        if (!value.trim()) {
          setErrorText('Please enter a message before submitting.');
          setValidationState('error');
          return;
        }
        console.log('Submitted:', value);
        setValue('');
        setValidationState('none');
      }}
      accessibilityLabel="Chat input with validation"
    />
  );
}
```

### Full Featured Chat Input

A fully featured `ChatInput` combining controlled text, file uploads, ghost suggestions, stop generation, and validation error handling in a single component — representing a production-ready AI chat input.

```tsx
import { useState, useRef } from 'react';
import { ChatInput } from '@razorpay/blade/components';
import type { BladeFileList } from '@razorpay/blade/components';

function FullFeaturedChatInput() {
  const [value, setValue] = useState('');
  const [files, setFiles] = useState<BladeFileList>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationState, setValidationState] = useState<'error' | 'none'>('none');
  const abortRef = useRef<AbortController | null>(null);

  const handleSubmit = ({ value, fileList }: { value: string; fileList: BladeFileList }): void => {
    if (!value.trim() && fileList.length === 0) {
      setValidationState('error');
      return;
    }
    const controller = new AbortController();
    abortRef.current = controller;
    setIsGenerating(true);
    setValue('');
    setFiles([]);
    setValidationState('none');

    setTimeout(() => setIsGenerating(false), 3000);
  };

  return (
    <ChatInput
      value={value}
      onChange={({ value }) => setValue(value)}
      onSubmit={handleSubmit}
      placeholder="Ask a question..."
      isGenerating={isGenerating}
      onStop={() => {
        abortRef.current?.abort();
        setIsGenerating(false);
      }}
      fileList={files}
      onFileChange={({ fileList }) => setFiles(fileList)}
      onFileRemove={({ file }) => setFiles((prev) => prev.filter((f) => f.id !== file.id))}
      accept=".jpg,.png,.pdf,.xlsx"
      suggestions={[
        'How do I integrate the payment gateway?',
        'Show me recent transactions',
        'Help me set up webhooks',
      ]}
      onSuggestionAccept={({ suggestion }) => setValue(suggestion)}
      validationState={validationState}
      errorText="Please type a message or attach a file before submitting."
      onErrorDismiss={() => setValidationState('none')}
      accessibilityLabel="AI chat input"
    />
  );
}
```

### Compact Size

```tsx
import React, { useState } from 'react';
import { ChatInput } from '@razorpay/blade/components';

const CompactChatInput = () => {
  const [value, setValue] = useState('');
  return (
    <ChatInput
      size="small"
      placeholder="Ask Ray anything"
      value={value}
      onChange={({ value }) => setValue(value)}
      onSubmit={() => setValue('')}
      accessibilityLabel="Ask Ray"
    />
  );
};
```

### Status, Context Chips, + Menu and Slash Commands

```tsx
import React, { useState } from 'react';
import {
  ChatInput,
  MenuItem,
  MenuOverlay,
  PaperclipIcon,
  Tag,
} from '@razorpay/blade/components';
import type { ChatInputStatus } from '@razorpay/blade/components';

const AIComposer = ({ sendMessage, stop }: { sendMessage: (text: string) => Promise<void>; stop: () => void }) => {
  const [status, setStatus] = useState<ChatInputStatus>('ready');
  const [hasContext, setHasContext] = useState(true);

  return (
    <ChatInput
      status={status}
      placeholder="Ask Ray anything about your payments"
      accessibilityLabel="Ask Ray"
      header={
        hasContext ? <Tag onDismiss={() => setHasContext(false)}>pay_Qx81Lm2</Tag> : undefined
      }
      actionMenu={({ openFilePicker }) => (
        <MenuOverlay>
          <MenuItem title="Upload files" leading={<PaperclipIcon />} onClick={openFilePicker} />
        </MenuOverlay>
      )}
      commands={[{ value: 'refund', title: 'refund', description: 'Refund a payment' }]}
      onCommandSelect={({ value }) => console.log('command', value)}
      clearOnSubmit
      onSubmit={async ({ value }) => {
        setStatus('submitted');
        try {
          await sendMessage(value); // ChatInput clears the box when this resolves
          setStatus('ready');
        } catch (error) {
          setStatus('error'); // the text stays; Send becomes Retry
          throw error;
        }
      }}
      onStop={() => {
        stop();
        setStatus('ready');
      }}
    />
  );
};
```

### File Limits and Drop

```tsx
import React, { useState } from 'react';
import { ChatInput } from '@razorpay/blade/components';
import type { BladeFileList } from '@razorpay/blade/components';

const ChatInputWithFileLimits = () => {
  const [files, setFiles] = useState<BladeFileList>([]);
  const [fileError, setFileError] = useState<string>();

  return (
    <ChatInput
      accept="image/*,.pdf"
      maxCount={3}
      maxSize={5 * 1024 * 1024}
      dropTarget="page"
      fileList={files}
      onFileChange={({ fileList }) => setFiles(fileList)}
      onFileRemove={({ file }) => setFiles((items) => items.filter((f) => f.id !== file.id))}
      onFileError={({ message }) => setFileError(message)}
      validationState={fileError ? 'error' : 'none'}
      errorText={fileError}
      onErrorDismiss={() => setFileError(undefined)}
      accessibilityLabel="Ask Ray"
    />
  );
};
```

### Ambient Border

```tsx
import React from 'react';
import { ChatInput } from '@razorpay/blade/components';

const ChatInputWithAmbientBorder = () => (
  <ChatInput showAmbientBorder placeholder="Ask Ray anything" accessibilityLabel="Ask Ray" />
);
```

