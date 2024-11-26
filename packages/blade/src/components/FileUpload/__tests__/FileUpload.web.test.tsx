import React from 'react';
import { FileUpload } from '../FileUpload';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

describe('<FileUpload />', () => {
  it('should render FileUpload', () => {
    const { container, getByText } = renderWithTheme(
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        helpText="Upload .jpg, .jpeg, or .png file only"
        accept="image/*"
        name="single-file-upload-input"
      />,
    );
    expect(container).toMatchSnapshot();
    const input = getByText('Drag files here or').closest('div')?.querySelector('input');
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAttribute('accept', 'image/*');
    expect(input).toHaveAttribute('name', 'single-file-upload-input');
  });

  it('should render FileUpload with size="large"', () => {
    const { container, getByText } = renderWithTheme(
      <FileUpload
        uploadType="single"
        size="large"
        label="Upload GST certificate"
        helpText="Upload .jpg, .jpeg, or .png file only"
        accept="image/*"
        name="single-file-upload-input"
      />,
    );
    expect(container).toMatchSnapshot();
    const input = getByText('Drag files here or').closest('div')?.querySelector('input');
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAttribute('accept', 'image/*');
    expect(input).toHaveAttribute('name', 'single-file-upload-input');
  });

  it('should set disabled state with isDisabled', () => {
    const { container, getByText } = renderWithTheme(
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        helpText="Upload .jpg, .jpeg, or .png file only"
        accept="image/*"
        name="single-file-upload-input"
        isDisabled
      />,
    );
    expect(container).toMatchSnapshot();
    const input = getByText('Drag files here or').closest('div')?.querySelector('input');
    expect(input).toBeDisabled();
  });

  it('should set required state with isRequired', () => {
    const { getByText } = renderWithTheme(
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        helpText="Upload .jpg, .jpeg, or .png file only"
        accept="image/*"
        name="single-file-upload-input"
        isRequired
        necessityIndicator="required"
      />,
    );

    const input = getByText('Drag files here or').closest('div')?.querySelector('input');
    expect(input).toBeRequired();
  });

  it('should pas generals ally', async () => {
    const { container } = renderWithTheme(
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        helpText="Upload .jpg, .jpeg, or .png file only"
        accept="image/*"
        name="single-file-upload-input"
        isDisabled
      />,
    );

    await assertAccessible(container);
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        helpText="Upload .jpg, .jpeg, or .png file only"
        accept="image/*"
        name="single-file-upload-input"
        isDisabled
        testID="file-upload-test"
      />,
    );

    expect(getByTestId('file-upload-test')).toBeTruthy();
  });

  it('should accept data-analytics attribute', () => {
    const { container } = renderWithTheme(
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        helpText="Upload .jpg, .jpeg, or .png file only"
        accept="image/*"
        name="single-file-upload-input"
        isDisabled
        data-analytics-file-upload="Upload gst certificate"
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
