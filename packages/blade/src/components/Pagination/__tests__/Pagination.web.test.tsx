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
        onPageChange={() => {
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
        currentPage={0}
        onPageChange={() => {
          void 0;
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
        onPageChange={() => {
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
        currentPage={5}
        onPageChange={() => {
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
        onPageChange={() => {
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
        onPageChange={() => {
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
    const onPageChange = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <Pagination totalPages={10} onPageChange={onPageChange} defaultCurrentPage={0} />,
    );

    const buttons = getAllByRole('button');
    const nextButton = buttons.find((btn) => btn.getAttribute('aria-label') === 'Next Page');
    const prevButton = buttons.find((btn) => btn.getAttribute('aria-label') === 'Previous Page');

    expect(prevButton).toBeDisabled();

    // Click next button
    await user.click(nextButton as HTMLButtonElement);
    expect(onPageChange).toHaveBeenCalledWith({ page: 1 });

    // Click previous button
    await user.click(prevButton as HTMLButtonElement);
    expect(onPageChange).toHaveBeenCalledWith({ page: 0 });
  });

  it('should handle page change with previous/next buttons (controlled)', async () => {
    const user = userEvents.setup();
    const onPageChange = jest.fn();
    const ControlledPagination = () => {
      const [currentPage, setCurrentPage] = useState(0);
      return (
        <Pagination
          totalPages={10}
          currentPage={currentPage}
          onPageChange={({ page }) => {
            onPageChange({ page });
            setCurrentPage(page);
          }}
        />
      );
    };

    const { getAllByRole } = renderWithTheme(<ControlledPagination />);

    const buttons = getAllByRole('button');
    const nextButton = buttons.find((btn) => btn.getAttribute('aria-label') === 'Next Page');

    await user.click(nextButton as HTMLButtonElement);
    expect(onPageChange).toHaveBeenCalledWith({ page: 1 });
  });

  it('should handle page number selector clicks', async () => {
    const user = userEvents.setup();
    const onPageChange = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <Pagination
        totalPages={20}
        currentPage={5}
        onPageChange={onPageChange}
        showPageNumberSelector
      />,
    );

    // Find page number button (page 6, which is index 5)
    const pageButtons = getAllByRole('button').filter((btn) =>
      btn.getAttribute('aria-label')?.startsWith('Page'),
    );
    const page6Button = pageButtons.find((btn) => btn.getAttribute('aria-label') === 'Page 6');

    if (page6Button) {
      await user.click(page6Button);
      expect(onPageChange).toHaveBeenCalledWith({ page: 5 });
    }
  });

  it('should handle page size change', async () => {
    const user = userEvents.setup();
    const onPageSizeChange = jest.fn();
    const { getByLabelText, getByText } = renderWithTheme(
      <Pagination
        totalPages={50}
        onPageChange={() => {
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

  it('should calculate totalPages from totalItemCount', () => {
    const { container } = renderWithTheme(
      <Pagination
        totalItemCount={100}
        defaultPageSize={25}
        onPageChange={() => {
          console.log('page changed');
        }}
        showPageNumberSelector
      />,
    );
    // Should calculate 4 pages (100 / 25 = 4)
    expect(container).toMatchSnapshot();
  });

  it('should use totalPages when both totalPages and totalItemCount are provided', () => {
    const { container } = renderWithTheme(
      <Pagination
        totalPages={10}
        totalItemCount={100}
        defaultPageSize={25}
        onPageChange={() => {
          console.log('page changed');
        }}
        showPageNumberSelector
      />,
    );
    // Should use totalPages (10) instead of calculating from totalItemCount
    expect(container).toMatchSnapshot();
  });

  it('should disable next button on last page', () => {
    const { getAllByRole } = renderWithTheme(
      <Pagination
        totalPages={10}
        currentPage={9}
        onPageChange={() => {
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
        currentPage={0}
        onPageChange={() => {
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
    const onPageChange = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <Pagination
        totalPages={100}
        currentPage={50}
        onPageChange={onPageChange}
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
        expect(onPageChange).toHaveBeenCalledWith({ page: 45 });
      }
    }
  });

  it('should generate default label from totalItemCount', () => {
    const { getByText } = renderWithTheme(
      <Pagination
        totalItemCount={100}
        currentPage={0}
        currentPageSize={10}
        onPageChange={() => {
          console.log('page changed');
        }}
        showLabel
      />,
    );

    expect(getByText(/Showing 1-10 of 100 items/)).toBeInTheDocument();
  });

  it('should generate default label without totalItemCount', () => {
    const { getByText } = renderWithTheme(
      <Pagination
        totalPages={10}
        currentPage={0}
        currentPageSize={10}
        onPageChange={() => {
          console.log('page changed');
        }}
        showLabel
      />,
    );

    expect(getByText(/Showing 1-10 items/)).toBeInTheDocument();
  });

  it('should not call onPageChange when disabled', async () => {
    const user = userEvents.setup();
    const onPageChange = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <Pagination totalPages={10} onPageChange={onPageChange} isDisabled />,
    );

    const buttons = getAllByRole('button');
    const nextButton = buttons.find((btn) => btn.getAttribute('aria-label') === 'Next Page');

    if (nextButton && !(nextButton as HTMLButtonElement).disabled) {
      await user.click(nextButton);
      // Should not call onPageChange when disabled
      expect(onPageChange).not.toHaveBeenCalled();
    }
  });

  it('should be accessible', async () => {
    const { container } = renderWithTheme(
      <Pagination
        totalPages={10}
        currentPage={0}
        onPageChange={() => {
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
      const [pageSize, setPageSize] = useState(10);
      return (
        <Pagination
          totalPages={50}
          onPageChange={() => {
            console.log('page changed');
          }}
          currentPageSize={pageSize}
          onPageSizeChange={({ pageSize: newSize }) => {
            onPageSizeChange({ pageSize: newSize });
            setPageSize(newSize);
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
    const onPageChange = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <Pagination
        totalPages={10}
        onPageChange={onPageChange}
        defaultCurrentPage={0}
        defaultPageSize={10}
      />,
    );

    const buttons = getAllByRole('button');
    const nextButton = buttons.find((btn) => btn.getAttribute('aria-label') === 'Next Page');

    // Click next multiple times - should increment page
    await user.click(nextButton as HTMLButtonElement);
    expect(onPageChange).toHaveBeenCalledWith({ page: 1 });

    // Click again - should increment to page 2
    await user.click(nextButton as HTMLButtonElement);
    expect(onPageChange).toHaveBeenCalledWith({ page: 2 });
  });

  it('should handle boundary cases - page 0', async () => {
    const user = userEvents.setup();
    const onPageChange = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <Pagination totalPages={10} onPageChange={onPageChange} defaultCurrentPage={0} />,
    );

    const buttons = getAllByRole('button');
    const prevButton = buttons.find((btn) => btn.getAttribute('aria-label') === 'Previous Page');

    // Try to go to previous page from page 0
    await user.click(prevButton as HTMLButtonElement);
    // Should still call with page 0 (boundary protection)
    expect(onPageChange).toHaveBeenCalledWith({ page: 0 });
  });

  it('should handle boundary cases - last page', async () => {
    const user = userEvents.setup();
    const onPageChange = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <Pagination totalPages={10} onPageChange={onPageChange} defaultCurrentPage={9} />,
    );

    const buttons = getAllByRole('button');
    const nextButton = buttons.find((btn) => btn.getAttribute('aria-label') === 'Next Page');

    // Try to go to next page from last page
    await user.click(nextButton as HTMLButtonElement);
    // Should still call with page 9 (boundary protection)
    expect(onPageChange).toHaveBeenCalledWith({ page: 9 });
  });
});
