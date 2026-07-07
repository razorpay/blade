import React, { useState, useCallback } from 'react';
import { Pressable } from 'react-native';
import type { StoryFn, Meta } from '@storybook/react-vite';
import type { BladeFile, BladeFileList, FileUploadProps } from '../FileUpload';
import { FileUpload as FileUploadComponent } from '../FileUpload';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { Heading } from '~components/Typography/Heading';
import { Button } from '~components/Button';
import { Checkbox } from '~components/Checkbox';
import { Divider } from '~components/Divider';
import { Badge } from '~components/Badge';
import {
  BottomSheet,
  BottomSheetHeader,
  BottomSheetBody,
  BottomSheetFooter,
} from '~components/BottomSheet';

const MOCK_FILES: Array<{ name: string; size: number; type: string }> = [
  { name: 'invoice-2024.pdf', size: 245_760, type: 'application/pdf' },
  { name: 'screenshot.png', size: 1_048_576, type: 'image/png' },
  { name: 'report-q3.xlsx', size: 512_000, type: 'application/vnd.ms-excel' },
  { name: 'contract.docx', size: 153_600, type: 'application/msword' },
  { name: 'photo.jpg', size: 2_097_152, type: 'image/jpeg' },
  { name: 'design-mockup.figma', size: 3_145_728, type: 'application/octet-stream' },
  { name: 'presentation.pptx', size: 4_194_304, type: 'application/vnd.ms-powerpoint' },
  { name: 'data-export.csv', size: 102_400, type: 'text/csv' },
];

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
};

const createBladeFile = (
  mock: typeof MOCK_FILES[number],
  initialStatus: BladeFile['status'] = 'uploading',
): BladeFile => {
  return {
    name: mock.name,
    size: mock.size,
    type: mock.type,
    id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    status: initialStatus,
    uploadPercent: initialStatus === 'uploading' ? 0 : undefined,
  } as BladeFile;
};

export default {
  title: 'Components/FileUpload/Native Demo',
  component: FileUploadComponent,
  parameters: {
    docs: { disable: true },
  },
} as Meta<FileUploadProps>;

const simulateUpload = (
  fileId: string,
  setFiles: React.Dispatch<React.SetStateAction<BladeFileList>>,
  shouldFail = false,
): void => {
  let percent = 0;
  const interval = setInterval(() => {
    percent += Math.floor(Math.random() * 20) + 10;
    if (shouldFail && percent >= 40) {
      clearInterval(interval);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...f, status: 'error', errorText: 'Upload failed. File too large.' }
            : f,
        ),
      );
    } else if (percent >= 100) {
      clearInterval(interval);
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, status: 'success', uploadPercent: 100 } : f)),
      );
    } else {
      setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, uploadPercent: percent } : f)));
    }
  }, 300);
};

type MockFilePickerProps = {
  isOpen: boolean;
  onDismiss: () => void;
  onFilesSelected: (files: Array<typeof MOCK_FILES[number]>) => void;
  selectionMode: 'single' | 'multiple';
};

const MockFilePicker = ({
  isOpen,
  onDismiss,
  onFilesSelected,
  selectionMode,
}: MockFilePickerProps): React.ReactElement => {
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  const toggleFile = (index: number): void => {
    if (selectionMode === 'single') {
      const selected = MOCK_FILES[index];
      onFilesSelected([selected]);
      setSelectedIndices(new Set());
      onDismiss();
      return;
    }
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleDone = (): void => {
    const selected = Array.from(selectedIndices).map((i) => MOCK_FILES[i]);
    onFilesSelected(selected);
    setSelectedIndices(new Set());
    onDismiss();
  };

  const handleDismiss = (): void => {
    setSelectedIndices(new Set());
    onDismiss();
  };

  return (
    <BottomSheet isOpen={isOpen} onDismiss={handleDismiss}>
      <BottomSheetHeader
        title="Select Files"
        subtitle={
          selectionMode === 'single'
            ? 'Tap a file to upload'
            : `${selectedIndices.size} file${selectedIndices.size !== 1 ? 's' : ''} selected`
        }
      />
      <BottomSheetBody>
        <Box display="flex" flexDirection="column">
          {MOCK_FILES.map((file, index) => (
            <React.Fragment key={file.name}>
              <Pressable onPress={() => toggleFile(index)}>
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  paddingY="spacing.3"
                  paddingX="spacing.2"
                >
                  {selectionMode === 'multiple' && (
                    <Box marginRight="spacing.3">
                      <Checkbox
                        isChecked={selectedIndices.has(index)}
                        onChange={() => toggleFile(index)}
                      />
                    </Box>
                  )}
                  <Box display="flex" flexDirection="column" flex={1}>
                    <Text weight="semibold">{file.name}</Text>
                    <Text size="small" color="surface.text.gray.muted">
                      {formatFileSize(file.size)} &middot; {file.type.split('/')[1]}
                    </Text>
                  </Box>
                  <Badge size="small" color="information">
                    {file.name.split('.').pop()?.toUpperCase() ?? ''}
                  </Badge>
                </Box>
              </Pressable>
              {index < MOCK_FILES.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Box>
      </BottomSheetBody>
      {selectionMode === 'multiple' && (
        <BottomSheetFooter>
          <Box display="flex" flexDirection="row" gap="spacing.3">
            <Box flex={1}>
              <Button variant="secondary" onClick={handleDismiss} isFullWidth>
                Cancel
              </Button>
            </Box>
            <Box flex={1}>
              <Button onClick={handleDone} isDisabled={selectedIndices.size === 0} isFullWidth>
                Add {selectedIndices.size > 0 ? `(${selectedIndices.size})` : ''}
              </Button>
            </Box>
          </Box>
        </BottomSheetFooter>
      )}
    </BottomSheet>
  );
};

const SingleUploadTemplate: StoryFn<typeof FileUploadComponent> = () => {
  const [files, setFiles] = useState<BladeFileList>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleChange = useCallback(() => {
    setIsPickerOpen(true);
  }, []);

  const handleFilesSelected = useCallback((selected: Array<typeof MOCK_FILES[number]>) => {
    const newFile = createBladeFile(selected[0]);
    setFiles([newFile]);
    simulateUpload(newFile.id!, setFiles);
  }, []);

  return (
    <Box padding="spacing.5" maxWidth="400px">
      <Heading size="small" marginBottom="spacing.4">
        Single File Upload
      </Heading>
      <FileUploadComponent
        label="Upload Document"
        helpText="Tap to pick a mock file"
        uploadType="single"
        fileList={files}
        onChange={handleChange}
        onRemove={() => setFiles([])}
        onDismiss={() => setFiles([])}
        onReupload={({ file }) => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id
                ? { ...f, status: 'uploading', uploadPercent: 0, errorText: undefined }
                : f,
            ),
          );
          simulateUpload(file.id!, setFiles);
        }}
      />
      <Text size="small" color="surface.text.gray.muted" marginTop="spacing.3">
        Files: {files.length} | Status: {files[0]?.status ?? 'none'}
      </Text>
      <MockFilePicker
        isOpen={isPickerOpen}
        onDismiss={() => setIsPickerOpen(false)}
        onFilesSelected={handleFilesSelected}
        selectionMode="single"
      />
    </Box>
  );
};

export const SingleUpload = SingleUploadTemplate.bind({});
SingleUpload.storyName = 'Single Upload';

const MultiUploadTemplate: StoryFn<typeof FileUploadComponent> = () => {
  const [files, setFiles] = useState<BladeFileList>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleChange = useCallback(() => {
    setIsPickerOpen(true);
  }, []);

  const handleFilesSelected = useCallback((selected: Array<typeof MOCK_FILES[number]>) => {
    const newFiles = selected.map((s) => createBladeFile(s));
    setFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach((f) => simulateUpload(f.id!, setFiles));
  }, []);

  return (
    <Box padding="spacing.5" maxWidth="400px">
      <Heading size="small" marginBottom="spacing.4">
        Multi File Upload
      </Heading>
      <FileUploadComponent
        label="Upload Files"
        helpText="Tap to pick mock files"
        uploadType="multiple"
        fileList={files}
        onChange={handleChange}
        onRemove={({ file }) => setFiles((prev) => prev.filter((f) => f.id !== file.id))}
        onDismiss={({ file }) => setFiles((prev) => prev.filter((f) => f.id !== file.id))}
        onReupload={({ file }) => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id
                ? { ...f, status: 'uploading', uploadPercent: 0, errorText: undefined }
                : f,
            ),
          );
          simulateUpload(file.id!, setFiles);
        }}
      />
      <Text size="small" color="surface.text.gray.muted" marginTop="spacing.3">
        Total files: {files.length}
      </Text>
      <MockFilePicker
        isOpen={isPickerOpen}
        onDismiss={() => setIsPickerOpen(false)}
        onFilesSelected={handleFilesSelected}
        selectionMode="multiple"
      />
    </Box>
  );
};

export const MultiUpload = MultiUploadTemplate.bind({});
MultiUpload.storyName = 'Multi Upload';

const WithErrorTemplate: StoryFn<typeof FileUploadComponent> = () => {
  const [files, setFiles] = useState<BladeFileList>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const fileCountRef = React.useRef(0);

  const handleChange = useCallback(() => {
    setIsPickerOpen(true);
  }, []);

  const handleFilesSelected = useCallback((selected: Array<typeof MOCK_FILES[number]>) => {
    const newFiles = selected.map((s) => {
      fileCountRef.current++;
      return createBladeFile(s);
    });
    setFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach((f, i) => {
      const shouldFail = (fileCountRef.current - newFiles.length + i + 1) % 3 === 0;
      simulateUpload(f.id!, setFiles, shouldFail);
    });
  }, []);

  return (
    <Box padding="spacing.5" maxWidth="400px">
      <Heading size="small" marginBottom="spacing.4">
        Upload with Errors
      </Heading>
      <FileUploadComponent
        label="Upload Files"
        helpText="Every 3rd file will fail"
        uploadType="multiple"
        fileList={files}
        onChange={handleChange}
        onRemove={({ file }) => setFiles((prev) => prev.filter((f) => f.id !== file.id))}
        onDismiss={({ file }) => setFiles((prev) => prev.filter((f) => f.id !== file.id))}
        onReupload={({ file }) => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id
                ? { ...f, status: 'uploading', uploadPercent: 0, errorText: undefined }
                : f,
            ),
          );
          simulateUpload(file.id!, setFiles);
        }}
      />
      <MockFilePicker
        isOpen={isPickerOpen}
        onDismiss={() => setIsPickerOpen(false)}
        onFilesSelected={handleFilesSelected}
        selectionMode="multiple"
      />
    </Box>
  );
};

export const WithErrors = WithErrorTemplate.bind({});
WithErrors.storyName = 'With Errors';
