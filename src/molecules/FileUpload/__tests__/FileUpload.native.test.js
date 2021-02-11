import React from 'react';
import { fireEvent, act } from '@testing-library/react-native';
import FileUpload from '../index';
import { renderWithTheme } from '../../../_helpers/testing';

describe('<FileUpload />', () => {
  test('renders empty FileUpload component', () => {
    const { container } = renderWithTheme(<FileUpload />);
    expect(container).toMatchSnapshot();
  });

  test('should call onFileSelected when clicked on FileUpload Component', async () => {
    const onFileSelectedCallback = jest.fn();
    const { getByText } = renderWithTheme(<FileUpload onFileSelected={onFileSelectedCallback} />);
    const fileUploadComponent = getByText(/upload/i);

    await act(async () => {
      await fireEvent.press(fileUploadComponent);
    });

    expect(onFileSelectedCallback).toHaveBeenCalled();
    expect(onFileSelectedCallback).toHaveBeenCalledWith({
      name: 'someFileName',
      size: 2345,
      type: 'jpeg',
      uri: 'content://xyz.jpeg',
    });
  });

  test('should call onFileSelected when clicked on FileUpload Component', async () => {
    const onFileSelectedCallback = jest.fn();
    const { getByText } = renderWithTheme(<FileUpload onFileSelected={onFileSelectedCallback} />);
    const fileUploadComponent = getByText(/upload/i);

    await act(async () => {
      await fireEvent.press(fileUploadComponent);
    });

    expect(onFileSelectedCallback).toHaveBeenCalled();
    expect(onFileSelectedCallback).toHaveBeenCalledWith({
      name: 'someFileName',
      size: 2345,
      type: 'jpeg',
      uri: 'content://xyz.jpeg',
    });
  });

  test('renders FileUpload when file is already selected', () => {
    const { container } = renderWithTheme(<FileUpload progress={100} />);
    expect(container).toMatchSnapshot();
  });

  test('renders FileUpload with custom title', () => {
    const { getByText } = renderWithTheme(
      <FileUpload progress={80} fileName="abc" title="Uploading file abc" />,
    );
    expect(getByText(/uploading file abc/i)).toBeTruthy();
  });

  test('renders FileUpload with helpText', () => {
    const { getByText } = renderWithTheme(
      <FileUpload
        progress={80}
        fileName="abc"
        title="Uploading file abc"
        helpText="This is FileUpload helpText"
      />,
    );
    expect(getByText(/this is FileUpload helpText/i)).toBeTruthy();
  });

  test('renders FileUpload with errorText', () => {
    const { getByText } = renderWithTheme(
      <FileUpload
        progress={80}
        fileName="abc"
        title="Uploading file abc"
        errorText="This is FileUpload errorText"
      />,
    );
    expect(getByText(/this is FileUpload errorText/i)).toBeTruthy();
  });
});
