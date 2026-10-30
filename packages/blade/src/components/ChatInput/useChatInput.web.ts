import React from 'react';
import type { ChatInputCommand, ChatInputProps, ChatInputStatus } from './types';
import { chatInputMaxTextAreaHeight } from './chatInputTokens';
import { validateChatInputFiles } from './validateChatInputFiles';
import type { BladeElementRef } from '~utils/types';
import type { BladeFile, BladeFileList } from '~components/FileUpload/types';
import { useControllableState } from '~utils/useControllable';
import { useIsMobile } from '~utils/useIsMobile';
import { useMergeRefs } from '~utils/useMergeRefs';
import { useId } from '~utils/useId';
import { getChatInputSubmitDisabled } from './getChatInputSubmitDisabled';

type UseChatInputProps = Pick<
  ChatInputProps,
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'onSubmit'
  | 'isDisabled'
  | 'isGenerating'
  | 'status'
  | 'onStop'
  | 'fileList'
  | 'onFileChange'
  | 'onFileRemove'
  | 'onFileDismiss'
  | 'accept'
  | 'maxFileCount'
  | 'maxFileSize'
  | 'onFileError'
  | 'dropTarget'
  | 'suggestions'
  | 'onSuggestionAccept'
  | 'commands'
  | 'onCommandSelect'
  | 'size'
>;

type CommandMenuState = {
  isOpen: boolean;
  listboxId: string;
  items: ChatInputCommand[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  getOptionId: (index: number) => string;
  select: (command: ChatInputCommand) => void;
};

const generateFileId = (): string => `${Date.now()}${Math.floor(Math.random() * 1000000)}`;

const hasFilesInDrag = (event: DragEvent | React.DragEvent): boolean =>
  Array.from(event.dataTransfer?.types ?? []).includes('Files');

// "/ref" -> "ref". Only the first word after a leading slash counts as a command query.
const getCommandQuery = (text: string): string | null => {
  const match = /^\/(\S*)$/.exec(text);
  return match ? match[1].toLowerCase() : null;
};

const useChatInput = (
  {
    value: controlledValue,
    defaultValue,
    onChange,
    onSubmit,
    isDisabled = false,
    isGenerating = false,
    status,
    fileList: controlledFileList,
    onFileChange,
    onFileRemove,
    onFileDismiss,
    accept,
    maxFileCount,
    maxFileSize,
    onFileError,
    dropTarget = 'input',
    suggestions,
    onSuggestionAccept,
    commands,
    onCommandSelect,
    size = 'medium',
  }: UseChatInputProps,
  ref: React.ForwardedRef<BladeElementRef>,
): {
  fileInputRef: React.RefObject<HTMLInputElement>;
  mergedRef: React.RefCallback<BladeElementRef>;
  textValue: string;
  files: BladeFileList;
  activeSuggestionIndex: number;
  setActiveSuggestionIndex: React.Dispatch<React.SetStateAction<number>>;
  hasText: boolean;
  hasFiles: boolean;
  hasContent: boolean;
  isSubmitDisabled: boolean;
  showGhostSuggestion: boolean;
  resolvedStatus: ChatInputStatus;
  isExpanded: boolean;
  isDraggingFiles: boolean;
  commandMenu: CommandMenuState;
  handleTextChange: (args: { name?: string; value?: string }) => void;
  handleSubmit: () => void;
  handleKeyDown: (args: {
    name?: string;
    key?: string;
    code?: string;
    event: React.KeyboardEvent<HTMLInputElement>;
  }) => void;
  handleUploadClick: () => void;
  handleFileInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileRemove: (file: BladeFile) => void;
  handleFileDismiss: (file: BladeFile) => void;
  handlePaste: (event: React.ClipboardEvent<HTMLInputElement>) => void;
  handleInnerMouseDownCapture: (event: React.MouseEvent) => void;
  dropZoneProps: {
    onDragEnter?: React.DragEventHandler<HTMLElement>;
    onDragOver?: React.DragEventHandler<HTMLElement>;
    onDragLeave?: React.DragEventHandler<HTMLElement>;
    onDrop?: React.DragEventHandler<HTMLElement>;
  };
} => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const textareaRef = React.useRef<BladeElementRef>(null);
  const mergedRef = useMergeRefs(ref, textareaRef);
  const isMountedRef = React.useRef(true);

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const [textValue, setTextValue] = useControllableState({
    value: controlledValue,
    defaultValue: defaultValue ?? '',
    onChange: (newValue) => {
      onChange?.({ value: newValue });
    },
  });

  const [files, setFiles] = useControllableState<BladeFileList>({
    value: controlledFileList,
    defaultValue: controlledFileList ?? [],
  });

  const [activeSuggestionIndex, setActiveSuggestionIndex] = React.useState(0);

  const isMobile = useIsMobile();

  const hasText = textValue.trim().length > 0;
  const hasFiles = files.length > 0;
  const hasContent = hasText || hasFiles;
  const isSubmitDisabled = getChatInputSubmitDisabled(textValue, files);
  const showGhostSuggestion = !hasText && Boolean(suggestions?.length) && !isMobile;
  const resolvedStatus: ChatInputStatus = status ?? (isGenerating ? 'streaming' : 'ready');

  // size="small" starts as one row and opens into the full layout once the text needs a second
  // line. It stays open until the text is cleared, so it never flips back and forth while typing.
  const [isExpanded, setIsExpanded] = React.useState(false);
  const isSmall = size === 'small';

  const adjustTextareaHeight = React.useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea && textarea instanceof HTMLTextAreaElement) {
      textarea.style.height = 'auto';
      const { scrollHeight } = textarea;
      textarea.style.height = `${Math.min(scrollHeight, chatInputMaxTextAreaHeight)}px`;

      if (isSmall && !isExpanded && typeof window !== 'undefined') {
        const style = window.getComputedStyle(textarea);
        const lineHeight = parseFloat(style.lineHeight);
        const verticalPadding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
        if (lineHeight > 0 && scrollHeight - verticalPadding > lineHeight * 1.5) {
          setIsExpanded(true);
        }
      }
    }
  }, [isSmall, isExpanded]);

  React.useEffect(() => {
    if (textValue.length === 0 && isExpanded) {
      setIsExpanded(false);
    }
  }, [textValue, isExpanded]);

  React.useEffect(() => {
    adjustTextareaHeight();
  }, [textValue, isExpanded, adjustTextareaHeight]);

  // Text can re-wrap without the value changing: the textarea gets narrower (container or window
  // resize) or the web font loads after mount. Re-measure then, so wrapped lines are never clipped.
  // Only width changes count, and the re-measure runs on the next frame: changing the observed
  // element's height inside the observer callback makes browsers report a ResizeObserver loop error.
  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (!(textarea instanceof HTMLTextAreaElement)) return undefined;

    let isActive = true;
    void document.fonts?.ready.then(() => {
      if (isActive) adjustTextareaHeight();
    });

    if (typeof ResizeObserver === 'undefined') {
      return () => {
        isActive = false;
      };
    }

    let lastWidth = textarea.clientWidth;
    let frame = 0;
    const resizeObserver = new ResizeObserver(() => {
      if (textarea.clientWidth === lastWidth) return;
      lastWidth = textarea.clientWidth;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(adjustTextareaHeight);
    });
    resizeObserver.observe(textarea);

    return () => {
      isActive = false;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [adjustTextareaHeight]);

  const handleTextChange = React.useCallback(
    ({ value: newValue }: { name?: string; value?: string }) => {
      setTextValue(() => newValue ?? '');
    },
    [setTextValue],
  );

  // ---------- files: the picker, paste and drop all go through the same checks ----------
  const addFiles = React.useCallback(
    (incomingFiles: BladeFile[]) => {
      if (incomingFiles.length === 0) return;
      const { acceptedFiles, fileErrors } = validateChatInputFiles({
        incomingFiles,
        existingFileCount: files.length,
        accept,
        maxFileCount,
        maxFileSize,
      });

      for (const file of acceptedFiles) {
        if (!file.id) {
          file.id = generateFileId();
        }
      }

      if (acceptedFiles.length > 0) {
        const newFileList = [...files, ...acceptedFiles];
        setFiles(() => newFileList);
        onFileChange?.({ fileList: newFileList });
      }

      // Errors come after onFileChange, so a product that clears its error message when files
      // change still shows the error for a batch where only some files were added.
      for (const fileError of fileErrors) {
        onFileError?.(fileError);
      }
    },
    [files, accept, maxFileCount, maxFileSize, onFileError, setFiles, onFileChange],
  );

  const handleSubmit = React.useCallback(() => {
    if (isSubmitDisabled) return;
    const result = onSubmit?.({ value: textValue, fileList: files });
    // A promise means ChatInput owns clearing: clear once it resolves, keep everything if it rejects.
    if (result && typeof (result as Promise<void>).then === 'function') {
      (result as Promise<void>).then(
        () => {
          if (!isMountedRef.current) return;
          setTextValue(() => '');
          if (files.length > 0) {
            setFiles(() => []);
            onFileChange?.({ fileList: [] });
          }
        },
        () => {
          // rejected: keep the text and files so the send can be retried
        },
      );
    }
  }, [isSubmitDisabled, onSubmit, textValue, files, setTextValue, setFiles, onFileChange]);

  // ---------- slash commands ----------
  const listboxId = useId('chat-input-commands');
  const [commandActiveIndex, setCommandActiveIndex] = React.useState(0);
  const [dismissedCommandText, setDismissedCommandText] = React.useState<string | null>(null);
  const commandQuery = commands?.length ? getCommandQuery(textValue) : null;
  const commandItems = React.useMemo(() => {
    if (commandQuery === null || !commands) return [];
    return commands.filter((command) => {
      const label = command.label.replace(/^\//, '').toLowerCase();
      return command.value.toLowerCase().startsWith(commandQuery) || label.startsWith(commandQuery);
    });
  }, [commands, commandQuery]);
  const isCommandMenuOpen =
    commandItems.length > 0 && dismissedCommandText !== textValue && !isDisabled;

  React.useEffect(() => {
    setCommandActiveIndex(0);
  }, [commandQuery]);

  const selectCommand = React.useCallback(
    (command: ChatInputCommand) => {
      onCommandSelect?.({ value: command.value });
      setTextValue(() => '');
      setDismissedCommandText(null);
    },
    [onCommandSelect, setTextValue],
  );

  const getOptionId = React.useCallback((index: number) => `${listboxId}-option-${index}`, [
    listboxId,
  ]);

  const handleKeyDown = React.useCallback(
    ({
      event,
    }: {
      name?: string;
      key?: string;
      code?: string;
      event: React.KeyboardEvent<HTMLInputElement>;
    }) => {
      if (!event) return;
      // An input method editor (Chinese, Japanese, Korean, ...) uses Enter to confirm a word.
      // That Enter must not send the message or pick a command.
      const isComposing = event.nativeEvent?.isComposing || event.keyCode === 229;

      if (isCommandMenuOpen && !isComposing) {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          setCommandActiveIndex((index) => (index + 1) % commandItems.length);
          return;
        }
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          setCommandActiveIndex((index) => (index - 1 + commandItems.length) % commandItems.length);
          return;
        }
        if (event.key === 'Enter' || event.key === 'Tab') {
          event.preventDefault();
          selectCommand(commandItems[commandActiveIndex] ?? commandItems[0]);
          return;
        }
        if (event.key === 'Escape') {
          event.preventDefault();
          setDismissedCommandText(textValue);
          return;
        }
      }

      if (event.key === 'Enter' && !event.shiftKey) {
        if (isComposing) return;
        event.preventDefault();
        handleSubmit();
        return;
      }

      if (event.key === 'Tab' && showGhostSuggestion && suggestions?.length) {
        event.preventDefault();
        const currentSuggestion = suggestions[activeSuggestionIndex];
        setTextValue(() => currentSuggestion);
        onSuggestionAccept?.({ suggestion: currentSuggestion });
      }
    },
    [
      isCommandMenuOpen,
      commandItems,
      commandActiveIndex,
      selectCommand,
      textValue,
      handleSubmit,
      showGhostSuggestion,
      suggestions,
      activeSuggestionIndex,
      setTextValue,
      onSuggestionAccept,
    ],
  );

  const handleUploadClick = React.useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      addFiles(Array.from(event.target.files ?? []) as BladeFile[]);
      event.target.value = '';
    },
    [addFiles],
  );

  const handleFileRemove = React.useCallback(
    (file: BladeFile) => {
      const newFileList = files.filter((f) => f.id !== file.id);
      setFiles(() => newFileList);
      onFileRemove?.({ file });
    },
    [files, setFiles, onFileRemove],
  );

  const handleFileDismiss = React.useCallback(
    (file: BladeFile) => {
      const newFileList = files.filter((f) => f.id !== file.id);
      setFiles(() => newFileList);
      onFileDismiss?.({ file });
    },
    [files, setFiles, onFileDismiss],
  );

  const handlePaste = React.useCallback(
    (event: React.ClipboardEvent<HTMLInputElement>) => {
      const clipboardFiles = Array.from(event.clipboardData?.files ?? []) as BladeFile[];
      if (clipboardFiles.length === 0) return;
      event.preventDefault();
      addFiles(clipboardFiles);
    },
    [addFiles],
  );

  // ---------- drop ----------
  const [isDraggingFiles, setIsDraggingFiles] = React.useState(false);
  const dragDepthRef = React.useRef(0);
  const canDrop = !isDisabled;

  // dropTarget="page": files can be dropped anywhere on the page. Only drags that carry files are
  // handled, so dragging text or links around the page keeps working as usual.
  React.useEffect(() => {
    if (dropTarget !== 'page' || !canDrop || typeof window === 'undefined') return undefined;

    const onWindowDragEnter = (event: DragEvent): void => {
      if (!hasFilesInDrag(event)) return;
      dragDepthRef.current += 1;
      setIsDraggingFiles(true);
    };
    const onWindowDragOver = (event: DragEvent): void => {
      if (!hasFilesInDrag(event)) return;
      event.preventDefault();
    };
    const onWindowDragLeave = (event: DragEvent): void => {
      if (!hasFilesInDrag(event)) return;
      dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
      if (dragDepthRef.current === 0) setIsDraggingFiles(false);
    };
    const onWindowDrop = (event: DragEvent): void => {
      if (!hasFilesInDrag(event)) return;
      event.preventDefault();
      dragDepthRef.current = 0;
      setIsDraggingFiles(false);
      addFiles(Array.from(event.dataTransfer?.files ?? []) as BladeFile[]);
    };

    window.addEventListener('dragenter', onWindowDragEnter);
    window.addEventListener('dragover', onWindowDragOver);
    window.addEventListener('dragleave', onWindowDragLeave);
    window.addEventListener('drop', onWindowDrop);
    return () => {
      window.removeEventListener('dragenter', onWindowDragEnter);
      window.removeEventListener('dragover', onWindowDragOver);
      window.removeEventListener('dragleave', onWindowDragLeave);
      window.removeEventListener('drop', onWindowDrop);
      dragDepthRef.current = 0;
    };
  }, [dropTarget, canDrop, addFiles]);

  const dropZoneProps =
    dropTarget === 'input' && canDrop
      ? {
          onDragEnter: (event: React.DragEvent<HTMLElement>) => {
            if (!hasFilesInDrag(event)) return;
            dragDepthRef.current += 1;
            setIsDraggingFiles(true);
          },
          onDragOver: (event: React.DragEvent<HTMLElement>) => {
            if (!hasFilesInDrag(event)) return;
            event.preventDefault();
          },
          onDragLeave: (event: React.DragEvent<HTMLElement>) => {
            if (!hasFilesInDrag(event)) return;
            dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
            if (dragDepthRef.current === 0) setIsDraggingFiles(false);
          },
          onDrop: (event: React.DragEvent<HTMLElement>) => {
            if (!hasFilesInDrag(event)) return;
            event.preventDefault();
            dragDepthRef.current = 0;
            setIsDraggingFiles(false);
            addFiles(Array.from(event.dataTransfer?.files ?? []) as BladeFile[]);
          },
        }
      : {};

  const handleInnerMouseDownCapture = React.useCallback((event: React.MouseEvent): void => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    // Allow normal behavior when clicking directly inside textarea.
    if (target.closest('textarea')) return;

    // Prevent focus from moving to internal controls (submit/upload/file actions).
    event.preventDefault();
  }, []);

  return {
    fileInputRef,
    mergedRef,
    textValue,
    files,
    activeSuggestionIndex,
    setActiveSuggestionIndex,
    hasText,
    hasFiles,
    hasContent,
    isSubmitDisabled,
    showGhostSuggestion,
    resolvedStatus,
    isExpanded,
    isDraggingFiles,
    commandMenu: {
      isOpen: isCommandMenuOpen,
      listboxId,
      items: commandItems,
      activeIndex: commandActiveIndex,
      setActiveIndex: setCommandActiveIndex,
      getOptionId,
      select: selectCommand,
    },
    handleTextChange,
    handleSubmit,
    handleKeyDown,
    handleUploadClick,
    handleFileInputChange,
    handleFileRemove,
    handleFileDismiss,
    handlePaste,
    handleInnerMouseDownCapture,
    dropZoneProps,
  };
};

export { useChatInput };
export type { UseChatInputProps };
