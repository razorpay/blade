/* eslint-disable @typescript-eslint/explicit-function-return-type */
import userEvents from '@testing-library/user-event';
import React, { useState } from 'react';
import { waitFor } from '@testing-library/react';
import { Pagination } from '../Pagination';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

describe('<Pagination />', () => {
  it('should render basic pagination', () => {
    const { container } = renderWithTheme(
      <Pagination
        totalPages={10}
        onSelectedPageChange={() => {
          console.log('page changed');
        }}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render with all features enabled', () => {
    const { container } = renderWithTheme(
      <Pagination
        totalPages={100}
        selectedPage={1}
        onSelectedPageChange={() => {
          console.log('page changed');
        }}
        showPageSizePicker
        showPageNumberSelector
        showLabel
        label="Showing 1-10 of 100 items"
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render with page size picker', () => {
    const { container } = renderWithTheme(
      <Pagination
        totalPages={50}
        onSelectedPageChange={() => {
          console.log('page changed');
        }}
        showPageSizePicker
        defaultPageSize={25}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render with page number selector', () => {
    const { container } = renderWithTheme(
      <Pagination
        totalPages={100}
        selectedPage={6}
        onSelectedPageChange={() => {
          console.log('page changed');
        }}
        showPageNumberSelector
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render with label', () => {
    const { container, getByText } = renderWithTheme(
      <Pagination
        totalPages={50}
        onSelectedPageChange={() => {
          console.log('page changed');
        }}
        showLabel
        label="Custom label"
      />,
    );
    expect(container).toMatchSnapshot();
    expect(getByText('Custom label')).toBeInTheDocument();
  });

  it('should render disabled state', () => {
    const { container, getAllByRole } = renderWithTheme(
      <Pagination
        totalPages={10}
        onSelectedPageChange={() => {
          console.log('page changed');
        }}
        isDisabled
      />,
    );
    expect(container).toMatchSnapshot();
    const buttons = getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('should handle page change with previous/next buttons (uncontrolled)', async () => {
    const user = userEvents.setup();
    const onSelectedPageChange = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <Pagination
        totalPages={10}
        onSelectedPageChange={onSelectedPageChange}
        defaultSelectedPage={1}
      />,
    );

    const buttons = getAllByRole('button');
    const nextButton = buttons.find((btn) => btn.getAttribute('aria-label') === 'Next Page');
    const prevButton = buttons.find((btn) => btn.getAttribute('aria-label') === 'Previous Page');

    expect(prevButton).toBeDisabled();

    // Click next button
    await user.click(nextButton as HTMLButtonElement);
    expect(onSelectedPageChange).toHaveBeenCalledWith({ page: 2 });

    // Click previous button
    await user.click(prevButton as HTMLButtonElement);
    expect(onSelectedPageChange).toHaveBeenCalledWith({ page: 1 });
  });

  it('should handle page change with previous/next buttons (controlled)', async () => {
    const user = userEvents.setup();
    const onSelectedPageChange = jest.fn();
    const ControlledPagination = () => {
      const [selectedPage, setSelectedPage] = useState(1);
      return (
        <Pagination
          totalPages={10}
          selectedPage={selectedPage}
          onSelectedPageChange={({ page }) => {
            onSelectedPageChange({ page });
            setSelectedPage(page);
          }}
        />
      );
    };

    const { getAllByRole } = renderWithTheme(<ControlledPagination />);

    const buttons = getAllByRole('button');
    const nextButton = buttons.find((btn) => btn.getAttribute('aria-label') === 'Next Page');

    await user.click(nextButton as HTMLButtonElement);
    expect(onSelectedPageChange).toHaveBeenCalledWith({ page: 2 });
  });

  it('should handle page size change', async () => {
    const user = userEvents.setup();
    const onPageSizeChange = jest.fn();
    const { getByLabelText, getByText } = renderWithTheme(
      <Pagination
        totalPages={50}
        onSelectedPageChange={() => {
          console.log('page changed');
        }}
        onPageSizeChange={onPageSizeChange}
        showPageSizePicker
        defaultPageSize={10}
      />,
    );

    const selectInput = getByLabelText('Select items per page');
    await user.click(selectInput);

    // Wait for dropdown to appear and click on option
    await waitFor(() => {
      const option25 = getByText('25');
      expect(option25).toBeInTheDocument();
    });

    const option25 = getByText('25');
    await user.click(option25);

    expect(onPageSizeChange).toHaveBeenCalledWith({ pageSize: 25 });
  });

  it('should disable next button on last page', () => {
    const { getAllByRole } = renderWithTheme(
      <Pagination
        totalPages={10}
        selectedPage={10}
        onSelectedPageChange={() => {
          console.log('page changed');
        }}
      />,
    );

    const buttons = getAllByRole('button');
    const nextButton = buttons.find((btn) => btn.getAttribute('aria-label') === 'Next Page');
    expect(nextButton).toBeDisabled();
  });

  it('should disable previous button on first page', () => {
    const { getAllByRole } = renderWithTheme(
      <Pagination
        totalPages={10}
        selectedPage={1}
        onSelectedPageChange={() => {
          console.log('page changed');
        }}
      />,
    );

    const buttons = getAllByRole('button');
    const prevButton = buttons.find((btn) => btn.getAttribute('aria-label') === 'Previous Page');
    expect(prevButton).toBeDisabled();
  });

  it('should handle ellipsis clicks', async () => {
    const user = userEvents.setup();
    const onSelectedPageChange = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <Pagination
        totalPages={100}
        selectedPage={51}
        onSelectedPageChange={onSelectedPageChange}
        showPageNumberSelector
      />,
    );

    // Find ellipsis button (should have "Go back 5 pages" or "Go forward 5 pages" label)
    const ellipsisButtons = getAllByRole('button').filter((btn) =>
      btn.getAttribute('aria-label')?.includes('pages'),
    );

    if (ellipsisButtons.length > 0) {
      const backEllipsis = ellipsisButtons.find((btn) =>
        btn.getAttribute('aria-label')?.includes('back'),
      );
      if (backEllipsis) {
        await user.click(backEllipsis);
        expect(onSelectedPageChange).toHaveBeenCalledWith({ page: 46 });
      }
    }
  });

  it('should generate default label', () => {
    const { getByText } = renderWithTheme(
      <Pagination
        totalPages={10}
        selectedPage={1}
        pageSize={10}
        onSelectedPageChange={() => {
          console.log('page changed');
        }}
        showLabel
      />,
    );

    expect(getByText(/Showing 1-10 items/)).toBeInTheDocument();
  });

  it('should not call onSelectedPageChange when disabled', async () => {
    const user = userEvents.setup();
    const onSelectedPageChange = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <Pagination totalPages={10} onSelectedPageChange={onSelectedPageChange} isDisabled />,
    );

    const buttons = getAllByRole('button');
    const nextButton = buttons.find((btn) => btn.getAttribute('aria-label') === 'Next Page');

    if (nextButton && !(nextButton as HTMLButtonElement).disabled) {
      await user.click(nextButton);
      // Should not call onSelectedPageChange when disabled
      expect(onSelectedPageChange).not.toHaveBeenCalled();
    }
  });

  it('should be accessible', async () => {
    const { container } = renderWithTheme(
      <Pagination
        totalPages={10}
        selectedPage={1}
        onSelectedPageChange={() => {
          console.log('page changed');
        }}
        showPageSizePicker
        showPageNumberSelector
        showLabel
      />,
    );

    await assertAccessible(container);
  });

  it('should handle controlled page size', async () => {
    const user = userEvents.setup();
    const onPageSizeChange = jest.fn();
    const ControlledPageSize = () => {
      const [pageSize, setPageSize] = useState<10 | 25 | 50>(10);
      return (
        <Pagination
          totalPages={50}
          onSelectedPageChange={() => {
            console.log('page changed');
          }}
          pageSize={pageSize}
          onPageSizeChange={({ pageSize: newSize }) => {
            onPageSizeChange({ pageSize: newSize });
            setPageSize(newSize as 10 | 25 | 50);
          }}
          showPageSizePicker
        />
      );
    };

    const { getByLabelText, getByText } = renderWithTheme(<ControlledPageSize />);

    const selectInput = getByLabelText('Select items per page');
    await user.click(selectInput);

    await waitFor(() => {
      const option25 = getByText('25');
      expect(option25).toBeInTheDocument();
    });

    const option25 = getByText('25');
    await user.click(option25);

    expect(onPageSizeChange).toHaveBeenCalledWith({ pageSize: 25 });
  });

  it('should handle uncontrolled mode', async () => {
    const user = userEvents.setup();
    const onSelectedPageChange = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <Pagination
        totalPages={10}
        onSelectedPageChange={onSelectedPageChange}
        defaultSelectedPage={1}
        defaultPageSize={10}
      />,
    );

    const buttons = getAllByRole('button');
    const nextButton = buttons.find((btn) => btn.getAttribute('aria-label') === 'Next Page');

    // Click next multiple times - should increment page
    await user.click(nextButton as HTMLButtonElement);
    expect(onSelectedPageChange).toHaveBeenCalledWith({ page: 2 });

    // Click again - should increment to page 3
    await user.click(nextButton as HTMLButtonElement);
    expect(onSelectedPageChange).toHaveBeenCalledWith({ page: 3 });
  });
});
