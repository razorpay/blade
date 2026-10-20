import React, { useEffect, useRef } from 'react';
import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/react';
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

  it('should hide the drop area text when dropAreaText is an empty string', async () => {
    const { container, queryByText, getByText, getByLabelText } = renderWithTheme(
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        accept="image/*"
        name="single-file-upload-input"
        dropAreaText=""
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
        dropAreaText=""
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

  it('should render a custom dropAreaText on small, medium and large sizes', () => {
    const { getByText, queryByText } = renderWithTheme(
      <FileUpload uploadType="single" label="Logo" dropAreaText="Drop your logo here or" />,
    );
    expect(getByText('Drop your logo here or')).toBeInTheDocument();
    expect(queryByText('Drag files here or')).not.toBeInTheDocument();
  });

  it('should hide the drop area text for size="variable" when dropAreaText is an empty string', () => {
    const { queryByText, getByText } = renderWithTheme(
      <FileUpload uploadType="single" size="variable" label="Documents" dropAreaText="" />,
    );
    expect(queryByText('Drag and drop your files here')).not.toBeInTheDocument();
    expect(getByText('Upload')).toBeInTheDocument();
  });

  it('should throw when actionButtonText is used without size="variable"', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    expect(() =>
      renderWithTheme(
        <FileUpload
          uploadType="single"
          label="Upload GST certificate"
          actionButtonText="Choose file"
        />,
      ),
    ).toThrow('actionButtonText can only be used when size is "variable"');
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

  it('should show the Reupload label when reupload is the only action in error state', () => {
    const { getByRole, getByText, queryByRole } = renderWithTheme(
      <FileUploadItem file={errorFile} onReupload={jest.fn()} />,
    );

    expect(getByRole('button', { name: 'Reupload test.png' })).toBeTruthy();
    expect(getByText('Reupload')).toBeVisible();
    expect(queryByRole('button', { name: 'Remove test.png' })).toBeNull();
  });

  it('should show an icon-only reupload button next to trash when both actions are provided', () => {
    const { getByRole, queryByText } = renderWithTheme(
      <FileUploadItem file={errorFile} onReupload={jest.fn()} onRemove={jest.fn()} />,
    );

    expect(getByRole('button', { name: 'Reupload test.png' })).toBeTruthy();
    expect(getByRole('button', { name: 'Remove test.png' })).toBeTruthy();
    expect(queryByText('Reupload')).toBeNull();
  });

  it('should not show a reupload button in error state when onReupload is not provided', () => {
    const { queryByRole } = renderWithTheme(<FileUploadItem file={errorFile} />);

    expect(queryByRole('button', { name: 'Reupload test.png' })).toBeNull();
  });

  it('should keep the file name findable while the file is uploading', () => {
    const uploadingFile = {
      id: 'file-3',
      name: 'video.mp4',
      size: 10240,
      status: 'uploading',
      uploadPercent: 45,
    } as BladeFile;

    const { getByText } = renderWithTheme(<FileUploadItem file={uploadingFile} />);

    expect(getByText('video.mp4')).toBeVisible();
    expect(getByText(/^Uploading/)).toBeVisible();
  });

  it('should hide the uploading prefix in compact layout', () => {
    const uploadingFile = {
      id: 'file-3',
      name: 'video.mp4',
      size: 10240,
      status: 'uploading',
      uploadPercent: 45,
    } as BladeFile;

    const { getByText, queryByText } = renderWithTheme(
      <FileUploadItem _isCompact file={uploadingFile} />,
    );

    expect(getByText('video.mp4')).toBeVisible();
    expect(queryByText(/Uploading/)).toBeNull();
  });

  it('should not show a remove button for a successful file when onRemove is not provided', () => {
    const successFile = {
      id: 'file-1',
      name: 'report.pdf',
      size: 2048,
      status: 'success',
    } as BladeFile;

    const { queryByRole, getByRole } = renderWithTheme(
      <FileUploadItem file={successFile} onPreview={jest.fn()} />,
    );

    expect(queryByRole('button', { name: 'Remove report.pdf' })).toBeNull();
    expect(getByRole('button', { name: 'Preview report.pdf' })).toBeTruthy();
  });

  it('should not show a file-type label in the leading icon', () => {
    const successFile = {
      id: 'file-1',
      name: 'report.pdf',
      size: 2048,
      status: 'success',
    } as BladeFile;

    const { queryByText } = renderWithTheme(<FileUploadItem file={successFile} />);

    expect(queryByText('.pdf')).toBeNull();
  });
});

describe('<FileUpload /> drop area border', () => {
  const getDropArea = (container: HTMLElement): HTMLElement =>
    container.querySelector<HTMLElement>('[data-comp="f"]')!;

  it('should keep the default border after a click and use the active border only while dragging', () => {
    const { container } = renderWithTheme(
      <FileUpload uploadType="single" label="Upload GST" name="gst" />,
    );
    const dropArea = getDropArea(container);
    const defaultBorder = getComputedStyle(dropArea).borderColor;

    fireEvent.click(dropArea);
    expect(getComputedStyle(dropArea).borderColor).toBe(defaultBorder);

    fireEvent.dragOver(dropArea);
    const dragBorder = getComputedStyle(dropArea).borderColor;
    expect(dragBorder).not.toBe(defaultBorder);

    fireEvent.dragLeave(dropArea);
    expect(getComputedStyle(dropArea).borderColor).toBe(defaultBorder);
  });
});

describe('<FileUpload /> failed files', () => {
  const errorFile = {
    id: 'file-1',
    name: 'test.png',
    size: 1024,
    status: 'error',
    errorText: 'Upload failed',
  } as BladeFile;

  it('should offer Reupload and no trash button for a failed file', () => {
    const { getByRole, getByText, queryByRole } = renderWithTheme(
      <FileUpload
        uploadType="multiple"
        label="Upload documents"
        fileList={[errorFile]}
        onRemove={jest.fn()}
      />,
    );

    expect(getByRole('button', { name: 'Reupload test.png' })).toBeTruthy();
    expect(getByText('Reupload')).toBeVisible();
    expect(queryByRole('button', { name: 'Remove test.png' })).toBeNull();
  });

  it('should not show a file-type label in the variable size drop area', () => {
    const { queryByText } = renderWithTheme(
      <FileUpload uploadType="single" label="Upload GST" size="variable" accept=".pdf" />,
    );

    expect(queryByText('.pdf')).toBeNull();
  });
});
