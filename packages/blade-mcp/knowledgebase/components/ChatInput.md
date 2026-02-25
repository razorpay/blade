# ChatInput

## Description

`ChatInput` is an input component designed for AI chat interfaces. It combines a resizable textarea, optional file upload with attachment previews, ghost suggestion autocomplete (cycling suggestions with a crossfade animation), and a submit/stop action button into a single composable input. It supports both controlled and uncontrolled text value usage, validation state with an animated error popup, and a generating state that swaps the submit button for a stop button to cancel in-flight AI responses.

## Important Constraints

- `suggestions` and `onSuggestionAccept` must be used together — providing `suggestions` without `onSuggestionAccept` means accepted suggestions are not propagated back to state.
- Most functionality of ChatInput is always controlled on consumer.

## TypeScript Types

These are the props accepted by `ChatInput` and the related file types it depends on.

```ts
// BladeFile — extends the native File interface with upload state fields
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

// BladeFileList — array of BladeFile objects
type BladeFileList = BladeFile[];

type ChatInputProps = {
  /** Controlled value of the text input */
  value?: string;

  /** Default value of the text input for uncontrolled usage */
  defaultValue?: string;

  /** Callback fired when the text input value changes */
  onChange?: ({ value }: { value: string }) => void;

  /**
   * Callback fired when the user submits the input (via submit button or Enter key).
   * Receives the current text value and the list of attached files.
   */
  onSubmit?: ({ value, fileList }: { value: string; fileList: BladeFileList }) => void;

  /** Placeholder text shown when the input is empty */
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

  /** List of attached files. Used for controlled file management. */
  fileList?: BladeFileList;

  /** Callback fired when files are selected via the upload button */
  onFileChange?: ({ fileList }: { fileList: BladeFileList }) => void;

  /** Callback fired when a file is removed from the attachment previews */
  onFileRemove?: ({ file }: { file: BladeFile }) => void;

  /**
   * File types that can be accepted. Follows the HTML input accept attribute format.
   * @example ".jpg,.png,.pdf" or "image/*"
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept
   */
  accept?: string;

  /**
   * List of ghost suggestions displayed as faded text in the input.
   * When multiple suggestions are provided, they cycle automatically with a crossfade animation.
   * The user can press TAB to accept the currently visible suggestion.
   */
  suggestions?: string[];

  /**
   * Callback fired when the user accepts the currently visible ghost suggestion (via TAB key).
   */
  onSuggestionAccept?: ({ suggestion }: { suggestion: string }) => void;

  /**
   * Indicates the validation state of the input.
   * When set to 'error', errorText is displayed as an animated popup sliding from behind the card.
   * @default 'none'
   */
  validationState?: 'error' | 'none';

  /** Error message displayed when validationState is 'error' */
  errorText?: string;

  /**
   * Callback fired when the user dismisses the error popup by clicking the close button.
   * When omitted, no close button is rendered in the error popup.
   */
  onErrorDismiss?: () => void;

  /**
   * Accessibility label for the input. Required when no visible label is present.
   * @default 'Chat input'
   */
  accessibilityLabel?: string;

  /** Test id for selecting the element in tests */
  testID?: string;
} & DataAnalyticsAttribute &
  StyledPropsBlade;
```

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
