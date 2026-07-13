import React from 'react';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { FileUploadItem } from '../FileUploadItem';
import { FileUpload } from '../FileUpload';
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

describe('<FileUploadItem category />', () => {
  it('should render the category trigger when categoryOptions is provided', () => {
    const onCategoryChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <FileUploadItem
        file={successFile}
        categoryOptions={categoryOptions}
        onCategoryChange={onCategoryChange}
      />,
    );

    expect(getByRole('button', { name: 'Select category for test.png' })).toBeTruthy();
  });

  it('should show placeholder text when no value is selected', () => {
    const onCategoryChange = jest.fn();
    const { getByText } = renderWithTheme(
      <FileUploadItem
        file={successFile}
        categoryOptions={categoryOptions}
        onCategoryChange={onCategoryChange}
        categoryPlaceholder="Select"
      />,
    );

    expect(getByText('Select')).toBeTruthy();
  });

  it('should show selected option title as the trigger label', () => {
    const onCategoryChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <FileUploadItem
        file={successFile}
        categoryOptions={categoryOptions}
        onCategoryChange={onCategoryChange}
        categoryValue="receipt"
      />,
    );

    const trigger = getByRole('button', { name: 'Select category for test.png' });
    expect(trigger.textContent).toContain('Receipt');
  });

  it('should NOT render the category selector when categoryOptions is an empty array', () => {
    const onCategoryChange = jest.fn();
    const { queryByRole } = renderWithTheme(
      <FileUploadItem
        file={successFile}
        categoryOptions={[]}
        onCategoryChange={onCategoryChange}
      />,
    );

    expect(queryByRole('button', { name: 'Select category for test.png' })).toBeNull();
  });

  it('should NOT render the category selector when size is variable', () => {
    const onCategoryChange = jest.fn();
    const { queryByRole } = renderWithTheme(
      <FileUploadItem
        file={successFile}
        size="variable"
        categoryOptions={categoryOptions}
        onCategoryChange={onCategoryChange}
      />,
    );

    expect(queryByRole('button', { name: 'Select category for test.png' })).toBeNull();
  });

  it('should NOT render the category selector when onCategoryChange is not provided', () => {
    const { queryByRole } = renderWithTheme(
      <FileUploadItem file={successFile} categoryOptions={categoryOptions} />,
    );

    expect(queryByRole('button', { name: 'Select category for test.png' })).toBeNull();
  });

  it('should NOT render the category selector when file is uploading', () => {
    const onCategoryChange = jest.fn();
    const uploadingFile: BladeFile = {
      id: 'file-2',
      name: 'uploading.png',
      size: 1024,
      status: 'uploading',
    } as BladeFile;

    const { queryByRole } = renderWithTheme(
      <FileUploadItem
        file={uploadingFile}
        categoryOptions={categoryOptions}
        onCategoryChange={onCategoryChange}
      />,
    );

    expect(queryByRole('button', { name: 'Select category for uploading.png' })).toBeNull();
  });

  it('should fire onCategoryChange with value and file when an option is selected', async () => {
    const user = userEvent.setup();
    const onCategoryChange = jest.fn();

    const { getByRole, getAllByRole } = renderWithTheme(
      <FileUploadItem
        file={successFile}
        categoryOptions={categoryOptions}
        onCategoryChange={onCategoryChange}
      />,
    );

    const trigger = getByRole('button', { name: 'Select category for test.png' });
    await user.click(trigger);

    await waitFor(() => expect(getByRole('listbox')).toBeVisible());
    const options = getAllByRole('option');
    expect(options).toHaveLength(3);

    await user.click(options[1]);

    expect(onCategoryChange).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'receipt',
        file: successFile,
      }),
    );
  });

  it('should update trigger label after selection using a stateful wrapper', async () => {
    const user = userEvent.setup();

    const StatefulFileUploadItem = (): React.ReactElement => {
      const [selectedValue, setSelectedValue] = React.useState<string | undefined>(undefined);
      return (
        <FileUploadItem
          file={successFile}
          categoryOptions={categoryOptions}
          categoryValue={selectedValue}
          onCategoryChange={({ value }) => setSelectedValue(value)}
          categoryPlaceholder="Select"
        />
      );
    };

    const { getByRole, getAllByRole, getByText } = renderWithTheme(<StatefulFileUploadItem />);

    expect(getByText('Select')).toBeTruthy();

    const trigger = getByRole('button', { name: 'Select category for test.png' });
    await user.click(trigger);

    await waitFor(() => expect(getByRole('listbox')).toBeVisible());
    const options = getAllByRole('option');
    await user.click(options[0]);

    await waitFor(() => expect(getByText('Invoice')).toBeTruthy());
  });

  describe('keyboard navigation', () => {
    it('should open the dropdown with Enter and select with Enter', async () => {
      const user = userEvent.setup();
      const onCategoryChange = jest.fn();

      const { getByRole } = renderWithTheme(
        <FileUploadItem
          file={successFile}
          categoryOptions={categoryOptions}
          onCategoryChange={onCategoryChange}
        />,
      );

      const trigger = getByRole('button', { name: 'Select category for test.png' });
      trigger.focus();
      await user.keyboard('{Enter}');

      await waitFor(() => expect(getByRole('listbox')).toBeVisible());

      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      expect(onCategoryChange).toHaveBeenCalledWith(
        expect.objectContaining({
          value: 'invoice',
        }),
      );
    });

    it('should navigate options with ArrowDown and ArrowUp', async () => {
      const user = userEvent.setup();
      const onCategoryChange = jest.fn();

      const { getByRole } = renderWithTheme(
        <FileUploadItem
          file={successFile}
          categoryOptions={categoryOptions}
          onCategoryChange={onCategoryChange}
        />,
      );

      const trigger = getByRole('button', { name: 'Select category for test.png' });
      trigger.focus();
      await user.keyboard('{Enter}');

      await waitFor(() => expect(getByRole('listbox')).toBeVisible());

      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      expect(onCategoryChange).toHaveBeenCalledWith(
        expect.objectContaining({
          value: 'receipt',
        }),
      );
    });

    it('should close the dropdown with Escape', async () => {
      const user = userEvent.setup();
      const onCategoryChange = jest.fn();

      const { getByRole, queryByRole } = renderWithTheme(
        <FileUploadItem
          file={successFile}
          categoryOptions={categoryOptions}
          onCategoryChange={onCategoryChange}
        />,
      );

      const trigger = getByRole('button', { name: 'Select category for test.png' });
      trigger.focus();
      await user.keyboard('{Enter}');

      await waitFor(() => expect(getByRole('listbox')).toBeVisible());

      await user.keyboard('{Escape}');

      await waitFor(() => expect(queryByRole('listbox')).toBeNull());
    });
  });
});

describe('<FileUpload /> integration with category selector', () => {
  it('should throw when categoryOptions is used with size="variable"', () => {
    expect(() =>
      renderWithTheme(
        <FileUpload
          uploadType="single"
          size="variable"
          label="Upload"
          categoryOptions={categoryOptions}
          onCategoryChange={jest.fn()}
        />,
      ),
    ).toThrow('categoryOptions can only be used when size is "medium" or "large"');
  });

  it('should resolve per-file category values via categoryValue function', () => {
    const file1: BladeFile = {
      id: 'file-a',
      name: 'document1.pdf',
      size: 1024,
      status: 'success',
    } as BladeFile;
    const file2: BladeFile = {
      id: 'file-b',
      name: 'document2.pdf',
      size: 2048,
      status: 'success',
    } as BladeFile;

    const onCategoryChange = jest.fn();
    const categoryValueFn = (file: BladeFile): string | undefined => {
      if (file.id === 'file-a') return 'invoice';
      if (file.id === 'file-b') return 'receipt';
      return undefined;
    };

    const { getByRole } = renderWithTheme(
      <FileUpload
        uploadType="multiple"
        label="Upload documents"
        fileList={[file1, file2]}
        categoryOptions={categoryOptions}
        categoryValue={categoryValueFn}
        onCategoryChange={onCategoryChange}
      />,
    );

    const trigger1 = getByRole('button', { name: 'Select category for document1.pdf' });
    expect(trigger1.textContent).toContain('Invoice');

    const trigger2 = getByRole('button', { name: 'Select category for document2.pdf' });
    expect(trigger2.textContent).toContain('Receipt');
  });
});
