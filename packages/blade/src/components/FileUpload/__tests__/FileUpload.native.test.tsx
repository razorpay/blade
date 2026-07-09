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
    const { getByText } = renderWithTheme(
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        helpText="Upload .jpg, .jpeg, or .png file only"
        accept="image/*"
      />,
    );
    expect(getByText('Upload .jpg, .jpeg, or .png file only')).toBeTruthy();
  });

  it('should render error text when validationState is error', () => {
    const { getByText } = renderWithTheme(
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        accept="image/*"
        validationState="error"
        errorText="Something went wrong"
      />,
    );
    expect(getByText('Something went wrong')).toBeTruthy();
  });

  it('should call onUploadPress when upload area is pressed', () => {
    const onUploadPress = jest.fn();
    const onChange = jest.fn();
    const { getByText } = renderWithTheme(
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        accept="image/*"
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
        isDisabled
        onUploadPress={onUploadPress}
      />,
    );
    fireEvent.press(getByText('Upload'));
    expect(onUploadPress).not.toHaveBeenCalled();
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
