import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { FileUpload } from '../FileUpload';
import { FileUploadItem } from '../FileUploadItem';
import type { BladeFile } from '../types';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

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
    expect(toJSON()).toMatchSnapshot();
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
    expect(toJSON()).toMatchSnapshot();
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
    expect(toJSON()).toMatchSnapshot();
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

  it('should call onChange with empty fileList when upload area is pressed', () => {
    const onChange = jest.fn();
    const { getByText } = renderWithTheme(
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        name="single-file-upload-input"
        fileList={[]}
        onChange={onChange}
      />,
    );

    fireEvent.press(getByText('Upload'));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({
      name: 'single-file-upload-input',
      fileList: [],
    });
  });

  it('should call onClick when upload area is pressed (native-only callback)', () => {
    const onClick = jest.fn();
    const onChange = jest.fn();
    const { getByText } = renderWithTheme(
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        name="single-file-upload-input"
        fileList={[]}
        onClick={onClick}
        onChange={onChange}
      />,
    );

    fireEvent.press(getByText('Upload'));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith({ name: 'single-file-upload-input' });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should not call onChange when isDisabled and upload area is pressed', () => {
    const onChange = jest.fn();
    const { getByText } = renderWithTheme(
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        fileList={[]}
        onChange={onChange}
        isDisabled
      />,
    );

    fireEvent.press(getByText('Upload'));

    expect(onChange).not.toHaveBeenCalled();
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
        onChange={jest.fn()}
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
        onChange={jest.fn()}
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
        onChange={jest.fn()}
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
        onChange={jest.fn()}
        onDismiss={onDismiss}
      />,
    );

    fireEvent.press(getByLabelText(`Remove ${uploadingFile.name}`));

    expect(onDismiss).toHaveBeenCalledWith({ file: uploadingFile });
  });

  it('should call onReupload and re-fire onClick (not onChange) for picker reopen', () => {
    const onReupload = jest.fn();
    const onClick = jest.fn();
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
        onClick={onClick}
        onReupload={onReupload}
      />,
    );

    fireEvent.press(getByLabelText(`Reupload ${errorFile.name}`));

    expect(onReupload).toHaveBeenCalledWith({ file: errorFile });
    // Mirrors web inputRef.click(): reopen signal via onClick only (no onChange([])).
    expect(onClick).toHaveBeenCalledWith({ name: 'single-file-upload-input' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should fall back to onRemove when onReupload is not provided', () => {
    const onRemove = jest.fn();
    const onClick = jest.fn();
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
        onClick={onClick}
        onRemove={onRemove}
      />,
    );

    fireEvent.press(getByLabelText(`Reupload ${errorFile.name}`));

    // Matches web: when onReupload is omitted, reupload falls back to onRemove
    expect(onRemove).toHaveBeenCalledWith({ file: errorFile });
    expect(onClick).toHaveBeenCalledWith({ name: 'single-file-upload-input' });
    expect(onChange).not.toHaveBeenCalled();
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
    expect(toJSON()).toMatchSnapshot();
    expect(getByText('report.pdf')).toBeTruthy();
  });

  it('should render FileUploadItem with error status', () => {
    const { toJSON, getByText } = renderWithTheme(
      <FileUploadItem file={errorFile} onRemove={jest.fn()} />,
    );
    expect(toJSON()).toMatchSnapshot();
    expect(getByText('Upload failed')).toBeTruthy();
  });

  it('should render FileUploadItem with uploading status', () => {
    const { toJSON, getByText } = renderWithTheme(<FileUploadItem file={uploadingFile} />);
    expect(toJSON()).toMatchSnapshot();
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
    expect(toJSON()).toMatchSnapshot();
  });
});
