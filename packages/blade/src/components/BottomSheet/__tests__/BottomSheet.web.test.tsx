/* eslint-disable no-global-assign */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import userEvents from '@testing-library/user-event';
import { mockViewport } from 'jsdom-testing-mocks';
import { fireEvent, waitFor, within } from '@testing-library/react';
import { BottomSheet, BottomSheetHeader, BottomSheetBody, BottomSheetFooter } from '../BottomSheet';
import { Counter } from '../../Counter';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Text } from '~components/Typography';
import { Button } from '~components/Button';
import { Dropdown, DropdownButton } from '~components/Dropdown';
import { SelectInput } from '~components/Input/DropdownInputTriggers';
import { ActionList, ActionListItem } from '~components/ActionList';
import { Badge } from '~components/Badge';

jest.mock('~utils/useId', () => ({
  useId: () => 'dropdown-456',
}));

const SingleSelectContent = (): React.ReactElement => {
  return (
    <ActionList>
      <ActionListItem title="Home" value="Home" />
      <ActionListItem title="Settings" value="settings" />
      <ActionListItem title="Info" value="info" />
      <ActionListItem title="Price" value="price" />
      <ActionListItem title="Contact" value="contact" />
      <ActionListItem title="About" value="about" />
    </ActionList>
  );
};

const MultiSelectContent = (): React.ReactElement => {
  const fruites = [
    'Apple',
    'Apricot',
    'Avocado',
    'Banana',
    'Orange',
    'Blackberry',
    'Blueberry',
    'Cherry',
    'Coconut',
    'Cucumber',
    'Durian',
  ];

  return (
    <ActionList>
      {fruites.map((fruit) => {
        return <ActionListItem key={fruit} title={fruit} value={fruit} />;
      })}
    </ActionList>
  );
};

describe('<BottomSheet />', () => {
  const viewport = mockViewport({ width: '320px', height: '568px' });

  beforeEach(() => {
    jest.resetModules();
  });

  it('should render Header/Footer/Body properly on closed state', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

    const Example = (): React.ReactElement => {
      return (
        <BottomSheet isOpen={false}>
          <BottomSheetHeader
            title="Address Details"
            subtitle="Saving addresses will improve your checkout experience"
            trailing={<Badge color="positive">Action Needed</Badge>}
            titleSuffix={<Counter color="positive" value={2} />}
          />
          <BottomSheetBody>
            <Text>BottomSheet body</Text>
          </BottomSheetBody>
          <BottomSheetFooter>
            <Button isFullWidth variant="secondary">
              Remove address
            </Button>
          </BottomSheetFooter>
        </BottomSheet>
      );
    };
    const { baseElement } = renderWithTheme(<Example />);
    expect(baseElement).toMatchSnapshot();
    mockConsoleError.mockRestore();
  });

  it('should render Header/Footer/Body properly on opened state', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

    const Example = (): React.ReactElement => {
      return (
        <BottomSheet isOpen={true}>
          <BottomSheetHeader
            title="Address Details"
            subtitle="Saving addresses will improve your checkout experience"
            trailing={<Badge color="positive">Action Needed</Badge>}
            titleSuffix={<Counter color="positive" value={2} />}
          />
          <BottomSheetBody>
            <Text>BottomSheet body</Text>
          </BottomSheetBody>
          <BottomSheetFooter>
            <Button isFullWidth variant="secondary">
              Remove address
            </Button>
          </BottomSheetFooter>
        </BottomSheet>
      );
    };
    const { baseElement } = renderWithTheme(<Example />);
    expect(baseElement).toMatchSnapshot();
    mockConsoleError.mockRestore();
  });

  it('should render empty header with padding 0', () => {
    const Example = (): React.ReactElement => {
      return (
        <BottomSheet isOpen={true}>
          <BottomSheetHeader />
          <BottomSheetBody padding="spacing.0">
            <Text>BottomSheet body</Text>
          </BottomSheetBody>
        </BottomSheet>
      );
    };
    const { baseElement } = renderWithTheme(<Example />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should open/close BottomSheet', async () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    const user = userEvents.setup();

    const Example = (): React.ReactElement => {
      const [isOpen, setIsOpen] = React.useState(false);

      return (
        <>
          <Button onClick={() => setIsOpen(true)}>Open</Button>
          <BottomSheet isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
            <BottomSheetHeader title="Select Account" />
            <BottomSheetBody>
              <Text>BottomSheet body</Text>
            </BottomSheetBody>
          </BottomSheet>
        </>
      );
    };
    const { getByRole, queryByText, queryByTestId } = renderWithTheme(<Example />);

    expect(queryByText('BottomSheet body')).not.toBeInTheDocument();
    await user.click(getByRole('button', { name: /open/i }));
    await waitFor(() => expect(queryByText('BottomSheet body')).toBeVisible());
    await user.click(queryByTestId('bottomsheet-backdrop')!);
    await waitFor(() => expect(queryByText('BottomSheet body')).not.toBeVisible());
    mockConsoleError.mockRestore();
  });

  it('should close with close button', async () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    const user = userEvents.setup();

    const Example = (): React.ReactElement => {
      const [isOpen, setIsOpen] = React.useState(false);

      return (
        <>
          <Button onClick={() => setIsOpen(true)}>Open</Button>
          <BottomSheet
            isOpen={isOpen}
            onDismiss={() => {
              console.log('click');
              setIsOpen(false);
            }}
          >
            <BottomSheetHeader title="Select Account" />
            <BottomSheetBody>
              <Text>BottomSheet body</Text>
            </BottomSheetBody>
          </BottomSheet>
        </>
      );
    };

    const { getByRole, queryByText } = renderWithTheme(<Example />);

    expect(queryByText('BottomSheet body')).not.toBeInTheDocument();
    await user.click(getByRole('button', { name: 'Open' }));
    await waitFor(() => expect(queryByText('BottomSheet body')).toBeInTheDocument());
    // for some reason userEvent.press didn't worked
    fireEvent.click(getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(queryByText('BottomSheet body')).not.toBeInTheDocument());
    mockConsoleError.mockRestore();
  });

  it('should work with initial state as open', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

    const Example = (): React.ReactElement => {
      return (
        <BottomSheet isOpen={true}>
          <BottomSheetBody>
            <Text>BottomSheet body</Text>
          </BottomSheetBody>
        </BottomSheet>
      );
    };
    const { queryByText } = renderWithTheme(<Example />);
    expect(queryByText('BottomSheet body')).toBeInTheDocument();
    mockConsoleError.mockRestore();
  });

  it('should render bottom sheet with custom zIndex', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

    const Example = (): React.ReactElement => {
      return (
        <BottomSheet isOpen={true} zIndex={425}>
          <BottomSheetBody>
            <Text>BottomSheet body</Text>
          </BottomSheetBody>
        </BottomSheet>
      );
    };
    const { queryByText, queryByTestId } = renderWithTheme(<Example />);
    expect(queryByText('BottomSheet body')).toBeInTheDocument();
    expect(queryByTestId('bottomsheet-surface')).toHaveStyle({ 'z-index': 425 });
    mockConsoleError.mockRestore();
  });

  it('should compose with Dropdown single select', async () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

    const user = userEvents.setup();

    const Example = (): React.ReactElement => {
      return (
        <Dropdown selectionType="single">
          <SelectInput label="Select Action" />
          <BottomSheet>
            <BottomSheetBody>
              <BottomSheetHeader />
              <SingleSelectContent />
            </BottomSheetBody>
          </BottomSheet>
        </Dropdown>
      );
    };
    const { queryByTestId, getByRole } = renderWithTheme(<Example />);

    // open / close by clicking the select
    expect(queryByTestId('bottomsheet-body')).not.toBeVisible();
    expect(getByRole('combobox', { name: 'Select Action' })).toBeInTheDocument();
    await user.click(getByRole('combobox', { name: 'Select Action' }));

    await waitFor(() => expect(queryByTestId('bottomsheet-body')).toBeVisible());
    await user.click(queryByTestId('bottomsheet-backdrop')!);
    await waitFor(() => expect(queryByTestId('bottomsheet-body')).not.toBeVisible());

    // close by selecting an element & assert the select's value
    await user.click(getByRole('combobox', { name: 'Select Action' }));
    await waitFor(() => expect(queryByTestId('bottomsheet-body')).toBeVisible());
    await user.click(getByRole('option', { name: 'Settings' }));
    await waitFor(() =>
      expect(getByRole('combobox', { name: 'Select Action' })).toHaveTextContent('Settings'),
    );
    expect(queryByTestId('bottomsheet-body')).not.toBeVisible();

    // check that cancelling should not update select's value
    await user.click(getByRole('combobox', { name: 'Select Action' }));
    await waitFor(() => expect(queryByTestId('bottomsheet-body')).toBeVisible());
    await user.click(getByRole('button', { name: /Close/i })!);
    await waitFor(() =>
      expect(getByRole('combobox', { name: 'Select Action' })).toHaveTextContent('Settings'),
    );
    expect(queryByTestId('bottomsheet-body')).not.toBeVisible();
    mockConsoleError.mockRestore();
  }, 10000);

  it('should compose with Dropdown multi select', async () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    mockConsoleError.mockRestore();

    const user = userEvents.setup();

    const Example = (): React.ReactElement => {
      return (
        <Dropdown selectionType="multiple">
          <SelectInput label="Select Fruit" />
          <BottomSheet>
            <BottomSheetHeader />
            <BottomSheetBody>
              <MultiSelectContent />
            </BottomSheetBody>
          </BottomSheet>
        </Dropdown>
      );
    };
    const { queryByTestId, getByRole, queryAllByLabelText } = renderWithTheme(<Example />);

    const selectInput = getByRole('combobox', { name: 'Select Fruit' });

    // open the dropdown
    expect(queryByTestId('bottomsheet-body')).not.toBeVisible();
    expect(selectInput).toBeInTheDocument();
    await user.click(selectInput);
    await waitFor(() => expect(queryByTestId('bottomsheet-body')).toBeVisible());

    // assert no items selected
    expect(selectInput).toHaveTextContent('Select Option');

    // select multiple elements
    expect(queryAllByLabelText('Close Apple tag')?.[0]).toBeFalsy();
    await user.click(getByRole('option', { name: 'Apple' }));
    expect(queryAllByLabelText('Close Apple tag')[0]).toBeInTheDocument();
    await user.click(getByRole('option', { name: 'Orange' }));
    expect(queryAllByLabelText('Close Apple tag')[0]).toBeInTheDocument();
    expect(queryAllByLabelText('Close Orange tag')[0]).toBeInTheDocument();

    // close the sheet
    await user.click(getByRole('button', { name: /Close$/i })!);
    expect(queryByTestId('bottomsheet-body')).not.toBeVisible();

    expect(queryAllByLabelText('Close Apple tag')[0]).toBeInTheDocument();
    expect(queryAllByLabelText('Close Orange tag')[0]).toBeInTheDocument();

    // open again and ensure the previously selected elements are there
    await user.click(selectInput);
    await waitFor(() => expect(queryByTestId('bottomsheet-body')).toBeVisible());
    expect(queryAllByLabelText('Close Apple tag')[0]).toBeInTheDocument();
    expect(queryAllByLabelText('Close Orange tag')[0]).toBeInTheDocument();

    expect(
      within(getByRole('option', { name: 'Apple' })).getByRole('checkbox', { hidden: true }),
    ).toBeChecked();
    expect(
      within(getByRole('option', { name: 'Orange' })).getByRole('checkbox', { hidden: true }),
    ).toBeChecked();
    expect(
      within(getByRole('option', { name: 'Banana' })).getByRole('checkbox', { hidden: true }),
    ).not.toBeChecked();
    expect(
      within(getByRole('option', { name: 'Avocado' })).getByRole('checkbox', { hidden: true }),
    ).not.toBeChecked();
    mockConsoleError.mockRestore();
  }, 10000);

  it('should compose with DropdownButton', async () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

    const user = userEvents.setup();

    const Example = (): React.ReactElement => {
      const [status, setStatus] = React.useState<string | undefined>('approve');

      return (
        <Dropdown>
          <DropdownButton variant="tertiary">Status: {status ?? ''}</DropdownButton>
          <BottomSheet>
            <BottomSheetBody>
              <BottomSheetHeader />
              <ActionList>
                <ActionListItem
                  onClick={({ name, value }) => {
                    console.log({ name, value });
                    setStatus(name);
                  }}
                  isSelected={status === 'approve'}
                  title="Approve"
                  value="approve"
                />
                <ActionListItem
                  onClick={({ name, value }) => {
                    console.log({ name, value });
                    setStatus(name);
                  }}
                  isSelected={status === 'in-progress'}
                  title="In Progress"
                  value="in-progress"
                />
                <ActionListItem
                  onClick={({ name, value }) => {
                    console.log({ name, value });
                    setStatus(name);
                  }}
                  isSelected={status === 'reject'}
                  title="Reject"
                  value="reject"
                  intent="negative"
                />
              </ActionList>
            </BottomSheetBody>
          </BottomSheet>
        </Dropdown>
      );
    };
    const { baseElement, queryByTestId, getByRole } = renderWithTheme(<Example />);
    expect(baseElement).toMatchSnapshot();

    // open / close by clicking the select
    expect(queryByTestId('bottomsheet-body')).not.toBeVisible();
    expect(getByRole('button', { name: 'Status: approve' })).toBeInTheDocument();
    await user.click(getByRole('button', { name: 'Status: approve' }));
    await waitFor(() => expect(queryByTestId('bottomsheet-body')).toBeVisible());
    await user.click(queryByTestId('bottomsheet-backdrop')!);
    await waitFor(() => expect(queryByTestId('bottomsheet-body')).not.toBeVisible());

    // close by selecting an element & assert the select's value
    await user.click(getByRole('button', { name: 'Status: approve' }));
    await waitFor(() => expect(queryByTestId('bottomsheet-body')).toBeVisible());
    await user.click(getByRole('menuitem', { name: 'In Progress' }));
    await waitFor(() => expect(queryByTestId('bottomsheet-body')).not.toBeVisible());

    // check that cancelling should not update select's value
    await user.click(getByRole('button', { name: 'Status: in-progress' }));
    await waitFor(() => expect(queryByTestId('bottomsheet-body')).toBeVisible());
    await user.click(getByRole('button', { name: /Close/i })!);

    await waitFor(() => expect(queryByTestId('bottomsheet-body')).not.toBeVisible());
    mockConsoleError.mockRestore();
  });

  it('should support data-analytics attributes', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

    const Example = (): React.ReactElement => {
      return (
        <BottomSheet isOpen={true}>
          <BottomSheetHeader
            title="Address Details"
            subtitle="Saving addresses will improve your checkout experience"
            trailing={<Badge color="positive">Action Needed</Badge>}
            titleSuffix={<Counter color="positive" value={2} />}
            data-analytics-sheet-header="address-details"
          />
          <BottomSheetBody data-analytics-sheet-body="sheet-body">
            <Text>BottomSheet body</Text>
          </BottomSheetBody>
          <BottomSheetFooter data-analytics-sheet-footer="sheet-action">
            <Button isFullWidth variant="secondary">
              Remove address
            </Button>
          </BottomSheetFooter>
        </BottomSheet>
      );
    };
    const { container } = renderWithTheme(<Example />);
    //check if container have data attributes
    expect(
      container.querySelector('[data-analytics-sheet-header="address-details"]'),
    ).toBeInTheDocument();
    expect(container.querySelector('[data-analytics-sheet-body="sheet-body"]')).toBeInTheDocument();
    expect(
      container.querySelector('[data-analytics-sheet-footer="sheet-action"]'),
    ).toBeInTheDocument();

    mockConsoleError.mockRestore();
  });

  test('BottomSheetHeader trailing should not allow any random component', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    const Example = (): React.ReactElement => {
      return (
        <BottomSheet isOpen={true}>
          <BottomSheetHeader title="Address" trailing={<p>random element</p>} />
        </BottomSheet>
      );
    };
    expect(() => renderWithTheme(<Example />)).toThrow(
      '[Blade: Header]: Only one of `Button, Badge, Link, Text, Amount` component is accepted as trailing',
    );
    mockConsoleError.mockRestore();
  });

  test('BottomSheetHeader trailing should warn about prop overrides', () => {
    jest.spyOn(console, 'warn').mockImplementation();
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

    const Example = (): React.ReactElement => {
      return (
        <BottomSheet isOpen={true}>
          <BottomSheetHeader title="Address" trailing={<Badge size="large">Hello</Badge>} />
        </BottomSheet>
      );
    };
    renderWithTheme(<Example />);

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining(
        '[Blade: Header]: Do not pass "size" to "Badge" while inside Header trailing, because we override it.',
      ),
    );

    mockConsoleError.mockRestore();
  });

  viewport.cleanup();
});
