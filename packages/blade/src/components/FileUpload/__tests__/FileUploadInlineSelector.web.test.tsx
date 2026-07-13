import React from 'react';
import userEvent from '@testing-library/user-event';
import { FileUploadItem } from '../FileUploadItem';
import type { BladeFile } from '../types';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

const successFile: BladeFile = {
  id: 'file-1',
  name: 'test.png',
  size: 1024,
  status: 'success',
} as BladeFile;

const categoryOptions = [
  { title: 'Invoice', value: 'invoice' },
  { title: 'Receipt', value: 'receipt' },
  { title: 'Contract', value: 'contract' },
];

describe('<FileUploadItem fileCategory />', () => {
  it('should render the category trigger when fileCategoryOptions is provided', () => {
    const onFileCategoryChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <FileUploadItem
        file={successFile}
        fileCategoryOptions={categoryOptions}
        onFileCategoryChange={onFileCategoryChange}
      />,
    );

    expect(getByRole('button', { name: 'Select category for test.png' })).toBeTruthy();
  });

  it('should show placeholder text when no value is selected', () => {
    const onFileCategoryChange = jest.fn();
    const { getByText } = renderWithTheme(
      <FileUploadItem
        file={successFile}
        fileCategoryOptions={categoryOptions}
        onFileCategoryChange={onFileCategoryChange}
        fileCategoryPlaceholder="Type"
      />,
    );

    expect(getByText('Type')).toBeTruthy();
  });

  it('should show selected option title as the trigger label', () => {
    const onFileCategoryChange = jest.fn();
    const { getByText } = renderWithTheme(
      <FileUploadItem
        file={successFile}
        fileCategoryOptions={categoryOptions}
        onFileCategoryChange={onFileCategoryChange}
        fileCategoryValue="receipt"
      />,
    );

    expect(getByText('Receipt')).toBeTruthy();
  });

  it('should NOT render the category selector when fileCategoryOptions is an empty array', () => {
    const onFileCategoryChange = jest.fn();
    const { queryByRole } = renderWithTheme(
      <FileUploadItem
        file={successFile}
        fileCategoryOptions={[]}
        onFileCategoryChange={onFileCategoryChange}
      />,
    );

    expect(queryByRole('button', { name: 'Select category for test.png' })).toBeNull();
  });

  it('should NOT render the category selector when size is variable', () => {
    const onFileCategoryChange = jest.fn();
    const { queryByRole } = renderWithTheme(
      <FileUploadItem
        file={successFile}
        size="variable"
        fileCategoryOptions={categoryOptions}
        onFileCategoryChange={onFileCategoryChange}
      />,
    );

    expect(queryByRole('button', { name: 'Select category for test.png' })).toBeNull();
  });

  it('should NOT render the category selector when onFileCategoryChange is not provided', () => {
    const { queryByRole } = renderWithTheme(
      <FileUploadItem file={successFile} fileCategoryOptions={categoryOptions} />,
    );

    expect(queryByRole('button', { name: 'Select category for test.png' })).toBeNull();
  });

  it('should NOT render the category selector when file is uploading', () => {
    const onFileCategoryChange = jest.fn();
    const uploadingFile: BladeFile = {
      id: 'file-2',
      name: 'uploading.png',
      size: 1024,
      status: 'uploading',
    } as BladeFile;

    const { queryByRole } = renderWithTheme(
      <FileUploadItem
        file={uploadingFile}
        fileCategoryOptions={categoryOptions}
        onFileCategoryChange={onFileCategoryChange}
      />,
    );

    expect(queryByRole('button', { name: 'Select category for uploading.png' })).toBeNull();
  });

  it('should fire onFileCategoryChange with values and file when an option is selected', async () => {
    const user = userEvent.setup();
    const onFileCategoryChange = jest.fn();

    const { getByRole, getAllByRole } = renderWithTheme(
      <FileUploadItem
        file={successFile}
        fileCategoryOptions={categoryOptions}
        onFileCategoryChange={onFileCategoryChange}
      />,
    );

    const trigger = getByRole('button', { name: 'Select category for test.png' });
    await user.click(trigger);

    const options = getAllByRole('option');
    expect(options).toHaveLength(3);

    await user.click(options[1]);

    expect(onFileCategoryChange).toHaveBeenCalledWith(
      expect.objectContaining({
        values: ['receipt'],
        file: successFile,
      }),
    );
  });

  it('should update trigger label after selection', async () => {
    const user = userEvent.setup();
    const onFileCategoryChange = jest.fn();

    const { getByRole, getAllByRole, getByText } = renderWithTheme(
      <FileUploadItem
        file={successFile}
        fileCategoryOptions={categoryOptions}
        onFileCategoryChange={onFileCategoryChange}
        fileCategoryPlaceholder="Type"
      />,
    );

    expect(getByText('Type')).toBeTruthy();

    const trigger = getByRole('button', { name: 'Select category for test.png' });
    await user.click(trigger);

    const options = getAllByRole('option');
    await user.click(options[0]);

    expect(onFileCategoryChange).toHaveBeenCalledWith(
      expect.objectContaining({
        values: ['invoice'],
      }),
    );
  });
});
