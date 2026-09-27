import React, { useEffect, useRef } from 'react';
import userEvent from '@testing-library/user-event';
import { FileUpload } from '../FileUpload';
import { FileUploadItem } from '../FileUploadItem';
import type { BladeFile } from '../FileUpload.web';
import { Box } from '~components/Box';
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

  it('should render FileUpload with size="small"', () => {
    const { container, getByText } = renderWithTheme(
      <FileUpload
        uploadType="single"
        size="small"
        label="Upload GST certificate"
        helpText="Upload .jpg, .jpeg, or .png file only"
        accept="image/*"
        name="single-file-upload-input"
      />,
    );
    expect(container).toMatchSnapshot();
    expect(getByText('Drag files here or')).toBeInTheDocument();
    expect(container.querySelector('[data-comp="f"]')).toHaveStyle({ height: '32px' });
  });

  it('should hide the drop area text with showDropAreaText={false}', async () => {
    const { container, queryByText, getByText, getByLabelText } = renderWithTheme(
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        accept="image/*"
        name="single-file-upload-input"
        showDropAreaText={false}
      />,
    );
    expect(queryByText('Drag files here or')).not.toBeInTheDocument();
    expect(getByText('Upload')).toBeInTheDocument();
    // The drop area is the <label> wrapping the file input, so the input keeps "Upload" as its name
    expect(getByLabelText('Upload')).toHaveAttribute('type', 'file');
    await assertAccessible(container);
  });

  it('should render the upload icon before the action text', () => {
    const { container, getByText } = renderWithTheme(
      <FileUpload
        uploadType="single"
        size="small"
        label="Logo"
        accept="image/*"
        name="logo-upload-input"
        showDropAreaText={false}
      />,
    );
    expect(container).toMatchSnapshot();
    const actionText = getByText('Upload');
    // Icon sits right before the action text
    expect(actionText.previousElementSibling?.tagName.toLowerCase()).toBe('svg');
  });

  it('should show errorText when validationState is error, even without helpText', () => {
    const { getByText, container } = renderWithTheme(
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        validationState="error"
        errorText="Please upload a file to continue"
      />,
    );
    expect(getByText('Please upload a file to continue')).toBeInTheDocument();
    expect(container).not.toHaveTextContent('null');
  });

  it('should throw when showDropAreaText is used with size="variable"', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    expect(() =>
      renderWithTheme(
        <FileUpload
          uploadType="single"
          size="variable"
          label="Upload GST certificate"
          // @ts-expect-error showDropAreaText is not allowed with size="variable"
          showDropAreaText={false}
        />,
      ),
    ).toThrow('showDropAreaText can only be used when size is "small", "medium" or "large"');
    mockConsoleError.mockRestore();
  });

  it('Should fire native events like input and change', async () => {
    const blob = new Blob(['']);
    const filename = 'my-image.png';
    const file = new File([blob], filename, {
      type: 'image/png',
    });
    const user = userEvent.setup();
    const handleInput = jest.fn();
    const handleChange = jest.fn();

    const DatePicker = (): React.ReactElement => {
      const ref = useRef<HTMLElement>(null);
      const addEventListeners = (): void => {
        if (ref.current) {
          ref.current.addEventListener('input', handleInput);
          ref.current.addEventListener('change', handleChange);
        }
      };

      const removeEventListeners = (): void => {
        if (ref.current) {
          ref.current.removeEventListener('input', handleInput);
          ref.current.removeEventListener('change', handleChange);
        }
      };

      useEffect(() => {
        addEventListeners();
        return removeEventListeners;
      }, []);
      return (
        <Box ref={ref}>
          <FileUpload
            uploadType="single"
            label="Upload GST certificate"
            helpText="Upload .jpg, .jpeg, or .png file only"
            accept="image/*"
            name="single-file-upload-input"
          />
        </Box>
      );
    };
    const { getByText } = renderWithTheme(<DatePicker />);

    const input = getByText('Drag files here or').closest('div')?.querySelector('input');

    await user.upload(input as HTMLElement, file);
    expect(getByText(filename)).toBeVisible();

    expect(handleChange).toBeCalled();
    expect(handleInput).toBeCalled();
  });
});

describe('<FileUploadItem />', () => {
  const errorFile = {
    id: 'file-1',
    name: 'test.png',
    size: 1024,
    status: 'error' as const,
    errorText: 'Upload failed',
  } as BladeFile;

  it('should show trash icon button in error state when onRemove is provided', () => {
    const onRemove = jest.fn();
    const { getByRole } = renderWithTheme(<FileUploadItem file={errorFile} onRemove={onRemove} />);

    expect(getByRole('button', { name: 'Remove test.png' })).toBeTruthy();
  });

  it('should NOT show trash icon button in error state when onRemove is not provided', () => {
    const { queryByRole } = renderWithTheme(<FileUploadItem file={errorFile} />);

    expect(queryByRole('button', { name: 'Remove test.png' })).toBeNull();
  });

  it('should call onRemove when trash icon is clicked in error state', async () => {
    const user = userEvent.setup();
    const onRemove = jest.fn();

    const { getByRole } = renderWithTheme(<FileUploadItem file={errorFile} onRemove={onRemove} />);

    await user.click(getByRole('button', { name: 'Remove test.png' }));

    expect(onRemove).toHaveBeenCalledWith({ file: errorFile });
  });
});
