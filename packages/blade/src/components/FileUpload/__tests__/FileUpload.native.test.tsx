import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { FileUpload } from '../FileUpload';
import { FileUploadItem } from '../FileUploadItem';
import type { BladeFile } from '../types';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

// useFormId / ProgressBar use process-global counters — values differ across CI shards.
const stabilizeAutoIds = (value: unknown): unknown =>
  JSON.parse(
    JSON.stringify(value).replace(
      /(fileuploadinput|progress-linear|label|helptext|errortext)-\d+/g,
      '$1-ID',
    ),
  );

describe('<FileUpload /> (native)', () => {
  it('should render FileUpload with default props', () => {
    const { toJSON, getByText } = renderWithTheme(
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        helpText="Upload .jpg, .jpeg, or .png file only"
        accept="image/*"
        name="single-file-upload-input"
      />,
    );
    expect(stabilizeAutoIds(toJSON())).toMatchSnapshot();
    expect(getByText('Tap to')).toBeTruthy();
    expect(getByText('Upload')).toBeTruthy();
  });

  it('should render FileUpload with size="large"', () => {
    const { toJSON } = renderWithTheme(
      <FileUpload
        uploadType="single"
        size="large"
        label="Upload GST certificate"
        helpText="Upload .jpg, .jpeg, or .png file only"
        accept="image/*"
        name="single-file-upload-input"
      />,
    );
    expect(stabilizeAutoIds(toJSON())).toMatchSnapshot();
  });

  it('should set disabled state with isDisabled', () => {
    const { toJSON } = renderWithTheme(
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        helpText="Upload .jpg, .jpeg, or .png file only"
        accept="image/*"
        name="single-file-upload-input"
        isDisabled
      />,
    );
    expect(stabilizeAutoIds(toJSON())).toMatchSnapshot();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        helpText="Upload .jpg, .jpeg, or .png file only"
        accept="image/*"
        name="single-file-upload-input"
        testID="file-upload-test"
      />,
    );
    expect(getByTestId('file-upload-test')).toBeTruthy();
  });

  it('should render help text', () => {
    const { getAllByText } = renderWithTheme(
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        helpText="Upload .jpg, .jpeg, or .png file only"
        accept="image/*"
      />,
    );
    expect(getAllByText('Upload .jpg, .jpeg, or .png file only').length).toBeGreaterThan(0);
  });

  it('should render error text when validationState is error', () => {
    const { getAllByText } = renderWithTheme(
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        accept="image/*"
        validationState="error"
        errorText="Something went wrong"
      />,
    );
    expect(getAllByText('Something went wrong').length).toBeGreaterThan(0);
  });

  it('should call onUploadPress when upload area is pressed', () => {
    const onUploadPress = jest.fn();
    const onChange = jest.fn();
    const { getByText } = renderWithTheme(
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        accept="image/*"
        fileList={[]}
        onUploadPress={onUploadPress}
        onChange={onChange}
      />,
    );
    fireEvent.press(getByText('Upload'));
    expect(onUploadPress).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should not call onUploadPress when isDisabled', () => {
    const onUploadPress = jest.fn();
    const { getByText } = renderWithTheme(
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        accept="image/*"
        fileList={[]}
        isDisabled
        onUploadPress={onUploadPress}
      />,
    );
    fireEvent.press(getByText('Upload'));
    expect(onUploadPress).not.toHaveBeenCalled();
  });

  it('should render FileUploadItem when controlled fileList is provided (single upload)', () => {
    const successFile = {
      id: 'file-1',
      name: 'report.pdf',
      size: 2048,
      status: 'success' as const,
    } as BladeFile;

    const { getByText, queryByText } = renderWithTheme(
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        fileList={[successFile]}
        onUploadPress={jest.fn()}
      />,
    );

    expect(getByText('report.pdf')).toBeTruthy();
    expect(queryByText('Upload')).toBeNull();
  });

  it('should render multiple FileUploadItems when controlled fileList is provided (multi upload)', () => {
    const files = [
      {
        id: 'file-1',
        name: 'report.pdf',
        size: 2048,
        status: 'success' as const,
      },
      {
        id: 'file-2',
        name: 'invoice.png',
        size: 1024,
        status: 'success' as const,
      },
    ] as BladeFile[];

    const { getByText } = renderWithTheme(
      <FileUpload
        uploadType="multiple"
        label="Upload GST certificate"
        fileList={files}
        onUploadPress={jest.fn()}
      />,
    );

    expect(getByText('report.pdf')).toBeTruthy();
    expect(getByText('invoice.png')).toBeTruthy();
    expect(getByText('Upload')).toBeTruthy();
  });

  it('should call onRemove through FileUpload when trash icon is pressed', () => {
    const onRemove = jest.fn();
    const successFile = {
      id: 'file-1',
      name: 'report.pdf',
      size: 2048,
      status: 'success' as const,
    } as BladeFile;

    const { getByLabelText } = renderWithTheme(
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        fileList={[successFile]}
        onUploadPress={jest.fn()}
        onRemove={onRemove}
      />,
    );

    fireEvent.press(getByLabelText(`Remove ${successFile.name}`));

    expect(onRemove).toHaveBeenCalledWith({ file: successFile });
  });

  it('should call onDismiss through FileUpload when close icon is pressed during upload', () => {
    const onDismiss = jest.fn();
    const uploadingFile = {
      id: 'file-3',
      name: 'video.mp4',
      size: 10240,
      status: 'uploading' as const,
      uploadPercent: 45,
    } as BladeFile;

    const { getByLabelText } = renderWithTheme(
      <FileUpload
        uploadType="multiple"
        label="Upload GST certificate"
        fileList={[uploadingFile]}
        onUploadPress={jest.fn()}
        onDismiss={onDismiss}
      />,
    );

    fireEvent.press(getByLabelText(`Remove ${uploadingFile.name}`));

    expect(onDismiss).toHaveBeenCalledWith({ file: uploadingFile });
  });

  it('should call onReupload without firing onUploadPress or onChange', () => {
    const onReupload = jest.fn();
    const onUploadPress = jest.fn();
    const onChange = jest.fn();
    const errorFile = {
      id: 'file-2',
      name: 'test.png',
      size: 1024,
      status: 'error' as const,
      errorText: 'Upload failed',
    } as BladeFile;

    const { getByLabelText } = renderWithTheme(
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        name="single-file-upload-input"
        fileList={[errorFile]}
        onChange={onChange}
        onUploadPress={onUploadPress}
        onReupload={onReupload}
      />,
    );

    fireEvent.press(getByLabelText(`Reupload ${errorFile.name}`));

    expect(onReupload).toHaveBeenCalledWith({ file: errorFile });
    expect(onUploadPress).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should fall back to onRemove when onReupload is not provided', () => {
    const onRemove = jest.fn();
    const onUploadPress = jest.fn();
    const onChange = jest.fn();
    const errorFile = {
      id: 'file-2',
      name: 'test.png',
      size: 1024,
      status: 'error' as const,
      errorText: 'Upload failed',
    } as BladeFile;

    const { getByLabelText } = renderWithTheme(
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        name="single-file-upload-input"
        fileList={[errorFile]}
        onChange={onChange}
        onUploadPress={onUploadPress}
        onRemove={onRemove}
      />,
    );

    fireEvent.press(getByLabelText(`Reupload ${errorFile.name}`));

    expect(onRemove).toHaveBeenCalledWith({ file: errorFile });
    expect(onUploadPress).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should call onPreview through FileUpload when preview icon is pressed', () => {
    const onPreview = jest.fn();
    const successFile = {
      id: 'file-1',
      name: 'report.pdf',
      size: 2048,
      status: 'success' as const,
    } as BladeFile;

    const { getByLabelText } = renderWithTheme(
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        fileList={[successFile]}
        onUploadPress={jest.fn()}
        onPreview={onPreview}
        onRemove={jest.fn()}
      />,
    );

    fireEvent.press(getByLabelText(`Preview ${successFile.name}`));
    expect(onPreview).toHaveBeenCalledWith({ file: successFile });
  });

  it('should render size="variable" with custom action and drop area text', () => {
    const { getByText, toJSON } = renderWithTheme(
      <FileUpload
        uploadType="single"
        size="variable"
        label="Upload GST certificate"
        actionButtonText="Choose file"
        dropAreaText="Tap to add documents"
        fileList={[]}
        onUploadPress={jest.fn()}
      />,
    );

    expect(getByText('Tap to add documents')).toBeTruthy();
    expect(getByText('Choose file')).toBeTruthy();
    expect(stabilizeAutoIds(toJSON())).toMatchSnapshot();
  });

  it('should render with accessibilityLabel when label is not provided', () => {
    const { getByLabelText, queryByText } = renderWithTheme(
      <FileUpload
        uploadType="single"
        accessibilityLabel="Upload identity document"
        fileList={[]}
        onUploadPress={jest.fn()}
      />,
    );

    expect(queryByText('Upload identity document')).toBeNull();
    expect(getByLabelText('Upload identity document')).toBeTruthy();
  });

  it('should fall back to onRemove for multi-file reupload when onReupload is not provided', () => {
    const onRemove = jest.fn();
    const onUploadPress = jest.fn();
    const errorFile = {
      id: 'file-2',
      name: 'test.png',
      size: 1024,
      status: 'error' as const,
      errorText: 'Upload failed',
    } as BladeFile;
    const successFile = {
      id: 'file-1',
      name: 'report.pdf',
      size: 2048,
      status: 'success' as const,
    } as BladeFile;

    const { getByLabelText } = renderWithTheme(
      <FileUpload
        uploadType="multiple"
        label="Upload GST certificate"
        fileList={[successFile, errorFile]}
        onUploadPress={onUploadPress}
        onRemove={onRemove}
      />,
    );

    fireEvent.press(getByLabelText(`Reupload ${errorFile.name}`));

    expect(onRemove).toHaveBeenCalledWith({ file: errorFile });
    expect(onUploadPress).not.toHaveBeenCalled();
  });

  it('should warn in __DEV__ when unsupported props are passed', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

    renderWithTheme(
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        accept="image/*"
        maxCount={2}
        maxSize={1024}
        onDrop={jest.fn()}
        labelPosition="left"
        fileList={[]}
        onUploadPress={jest.fn()}
      />,
    );

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Blade: FileUpload]: maxCount has no effect on React Native'),
    );
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Blade: FileUpload]: maxSize has no effect on React Native'),
    );
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Blade: FileUpload]: accept has no effect on React Native'),
    );
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Blade: FileUpload]: onDrop has no effect on React Native'),
    );
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Blade: FileUpload]: labelPosition="left" is not supported'),
    );

    warnSpy.mockRestore();
  });
});

describe('<FileUploadItem /> (native)', () => {
  const successFile = {
    id: 'file-1',
    name: 'report.pdf',
    size: 2048,
    status: 'success' as const,
  } as BladeFile;

  const errorFile = {
    id: 'file-2',
    name: 'test.png',
    size: 1024,
    status: 'error' as const,
    errorText: 'Upload failed',
  } as BladeFile;

  const uploadingFile = {
    id: 'file-3',
    name: 'video.mp4',
    size: 10240,
    status: 'uploading' as const,
    uploadPercent: 45,
  } as BladeFile;

  it('should render FileUploadItem with success status', () => {
    const { toJSON, getByText } = renderWithTheme(
      <FileUploadItem file={successFile} onRemove={jest.fn()} />,
    );
    expect(stabilizeAutoIds(toJSON())).toMatchSnapshot();
    expect(getByText('report.pdf')).toBeTruthy();
  });

  it('should render FileUploadItem with error status', () => {
    const { toJSON, getByText } = renderWithTheme(
      <FileUploadItem file={errorFile} onRemove={jest.fn()} />,
    );
    expect(stabilizeAutoIds(toJSON())).toMatchSnapshot();
    expect(getByText('Upload failed')).toBeTruthy();
  });

  it('should render FileUploadItem with uploading status', () => {
    const { toJSON, getByText } = renderWithTheme(<FileUploadItem file={uploadingFile} />);
    expect(stabilizeAutoIds(toJSON())).toMatchSnapshot();
    expect(getByText('video.mp4')).toBeTruthy();
  });

  it('should call onRemove when trash icon is pressed', () => {
    const onRemove = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <FileUploadItem file={successFile} onRemove={onRemove} />,
    );
    const removeButton = getByLabelText(`Remove ${successFile.name}`);
    fireEvent.press(removeButton);
    expect(onRemove).toHaveBeenCalledWith({ file: successFile });
  });

  it('should call onDismiss when close icon is pressed during upload', () => {
    const onDismiss = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <FileUploadItem file={uploadingFile} onDismiss={onDismiss} />,
    );
    const dismissButton = getByLabelText(`Remove ${uploadingFile.name}`);
    fireEvent.press(dismissButton);
    expect(onDismiss).toHaveBeenCalledWith({ file: uploadingFile });
  });

  it('should render multiple file items', () => {
    const files = [successFile, errorFile];
    const { toJSON } = renderWithTheme(
      <>
        {files.map((file) => (
          <FileUploadItem key={file.id} file={file} onRemove={jest.fn()} />
        ))}
      </>,
    );
    expect(stabilizeAutoIds(toJSON())).toMatchSnapshot();
  });
});
