import React from 'react';
import { FileUpload } from '../FileUpload';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<FileUpload />', () => {
  it('should render in SSR', () => {
    const { container, getByText } = renderWithSSR(
      <FileUpload
        uploadType="single"
        label="Upload GST certificate"
        helpText="Upload .jpg, .jpeg, or .png file only"
        accept="image/*"
        name="single-file-upload-input"
      />,
    );
    const input = getByText('Drag files here or').closest('div')?.querySelector('input');

    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAttribute('accept', 'image/*');
    expect(container).toMatchSnapshot();
  });
});
