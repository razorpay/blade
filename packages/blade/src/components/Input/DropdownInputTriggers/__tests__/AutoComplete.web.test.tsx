import React, { useEffect } from 'react';
import userEvent from '@testing-library/user-event';
import { waitFor, screen, act } from '@testing-library/react';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { DropdownFooter, DropdownHeader } from '~components/Dropdown/DropdownHeaderFooter';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { AutoComplete, SelectInput } from '~components/Input/DropdownInputTriggers';
import { ActionList, ActionListItem } from '~components/ActionList';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetFooter,
  BottomSheetHeader,
} from '~components/BottomSheet';

/**
 * @TODO
 *
 * - Write E2E tests for maxRows prop once we have e2e setup (jsdom is acting strange in tag calculation at multiple places even after mocking)
 */

jest.mock('~utils/useId', () => ({
  useId: () => 'dropdown-123',
}));

const getTag = (tagName: string): HTMLElement => {
  return screen.queryAllByLabelText(`Close ${tagName} tag`)?.[0];
};

describe('<Dropdown /> with <AutoComplete />', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should render dropdown and make it visible on click', async () => {
    const user = userEvent.setup();

    const { container, getByRole, queryByRole } = renderWithTheme(
      <Dropdown>
        <AutoComplete label="Fruits" />
        <DropdownOverlay zIndex={1002}>
          <DropdownHeader title="Recent Searches" />
          <ActionList>
            <ActionListItem title="Apple" value="apple" />
            <ActionListItem title="Mango" value="mango" />
          </ActionList>
          <DropdownFooter>
            <Box>
              <Button isFullWidth>Apply</Button>
            </Box>
          </DropdownFooter>
        </DropdownOverlay>
      </Dropdown>,
    );

    const selectInput = getByRole('combobox', { name: 'Fruits' });

    expect(selectInput).toBeInTheDocument();
    // testing library ignores the nodes because they are set to display none so using querySelector to select from dom instead.
    // the node becomes accessible after click on selectInput
    expect(queryByRole('dialog')).toBeNull();
    await user.click(selectInput);
    await waitFor(() => expect(getByRole('dialog', { name: 'Fruits' })).toBeVisible());
    expect(container).toMatchSnapshot();
  });

  it('should render autocomplete with large size', () => {
    const { container } = renderWithTheme(
      <Dropdown>
        <AutoComplete label="Fruits" size="large" />
        <DropdownOverlay zIndex={1002}>
          <DropdownHeader title="Recent Searches" />
          <ActionList>
            <ActionListItem title="Apple" value="apple" />
            <ActionListItem title="Mango" value="mango" />
          </ActionList>
          <DropdownFooter>
            <Box>
              <Button isFullWidth>Apply</Button>
            </Box>
          </DropdownFooter>
        </DropdownOverlay>
      </Dropdown>,
    );

    expect(container).toMatchSnapshot();
  });

  // MOUSE CLICK TESTS
  it('should handle AutoComplete behaviour in single select', async () => {
    const user = userEvent.setup();

    const { getByRole, queryByRole } = renderWithTheme(
      <Dropdown>
        <AutoComplete label="Cities" placeholder="Select Cities" />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Mumbai" value="mumbai" />
            <ActionListItem title="Bangalore" value="bangalore" />
            <ActionListItem title="Ooty" value="ooty" />
            <ActionListItem title="Pune" value="pune" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    const selectInput = getByRole('combobox', { name: 'Cities' }) as HTMLInputElement;

    expect(selectInput).toBeInTheDocument();
    expect(queryByRole('listbox')).toBeNull();

    await user.click(selectInput);
    await waitFor(() => expect(getByRole('listbox', { name: 'Cities' })).toBeVisible());

    // All elements should be visible
    expect(getByRole('option', { name: 'Pune' })).toBeVisible();
    expect(getByRole('option', { name: 'Mumbai' })).toBeVisible();

    // Start typing to filter, only filtered elements should be visible
    await user.keyboard('m');
    expect(queryByRole('option', { name: 'Pune' })).toBeFalsy();
    expect(getByRole('option', { name: 'Mumbai' })).toBeVisible();

    await user.keyboard('{Enter}');

    await waitFor(() => expect(queryByRole('listbox')).toBeNull());
    expect(selectInput.value).toBe('Mumbai');

    await user.click(selectInput);
    await waitFor(() => expect(getByRole('listbox', { name: 'Cities' })).toBeVisible());
    // clear input
    await user.keyboard('{BackSpace}'.repeat(selectInput.value.length));
    await user.keyboard('p');
    expect(queryByRole('option', { name: 'Mumbai' })).toBeFalsy();
    expect(getByRole('option', { name: 'Pune' })).toBeVisible();

    // Test for mouse click selection
    await user.click(getByRole('option', { name: 'Pune' }));
    await waitFor(() => expect(queryByRole('listbox')).toBeNull());
    expect(selectInput.value).toBe('Pune');
  }, 10000);

  it('should not open dropdown when input is disabled', async () => {
    const user = userEvent.setup();

    const { getByRole, queryByRole } = renderWithTheme(
      <Dropdown>
        <AutoComplete label="Fruits" isDisabled />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Banana" value="banana" />
            <ActionListItem title="Orange" value="orange" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    const autoComplete = getByRole('combobox', { name: 'Fruits' });

    expect(autoComplete).toBeInTheDocument();
    expect(queryByRole('listbox')).toBeNull();

    await user.click(autoComplete);
    expect(queryByRole('listbox')).toBeNull();
  });

  // https://github.com/razorpay/blade/issues/1676
  it('should update value when explicitly set in controlled single selection', async () => {
    const ControlledDropdown = (): React.ReactElement => {
      const [currentSelection, setCurrentSelection] = React.useState<string>('');

      return (
        <>
          <Button
            onClick={() => {
              setCurrentSelection('bangalore');
            }}
          >
            Select Bangalore
          </Button>
          <Button
            onClick={() => {
              setCurrentSelection('');
            }}
          >
            Clear Selection
          </Button>
          <Dropdown selectionType="single">
            <AutoComplete
              label="Select City"
              value={currentSelection}
              onChange={() => {
                // Simulate a case where the value isn't explicitly set in the onChange handler
                // setCurrentSelection(args?.values[0]);
              }}
            />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="Bangalore" value="bangalore" />
                <ActionListItem title="Pune" value="pune" />
                <ActionListItem title="Chennai" value="chennai" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </>
      );
    };

    const user = userEvent.setup();
    const { getByRole } = renderWithTheme(<ControlledDropdown />);

    const selectInput = getByRole('combobox', { name: 'Select City' });
    expect(selectInput).toHaveValue('');
    await user.click(getByRole('button', { name: 'Select Bangalore' }));
    expect(selectInput).toHaveValue('Bangalore');

    // Clicking on Pune should not change the value
    await user.click(selectInput);
    await user.click(getByRole('option', { name: 'Pune' }));
    expect(selectInput).toHaveValue('Bangalore');

    await user.click(getByRole('button', { name: 'Clear Selection' }));
    expect(selectInput).toHaveValue('');
  });
});

describe('<BottomSheet /> & <Dropdown /> with <AutoComplete />', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should render BottomSheet and make it visible on click', async () => {
    const user = userEvent.setup();

    const { container, getByLabelText, queryByTestId } = renderWithTheme(
      <Dropdown>
        <SelectInput testID="select" label="Fruits" />
        <BottomSheet>
          <BottomSheetHeader>
            <AutoComplete label="Fruits" testID="fruits-autocomplete" />
          </BottomSheetHeader>
          <BottomSheetBody>
            <ActionList>
              <ActionListItem title="Apple" value="apple" />
              <ActionListItem title="Mango" value="mango" />
            </ActionList>
          </BottomSheetBody>
          <BottomSheetFooter>
            <Box>
              <Button isFullWidth>Apply</Button>
            </Box>
          </BottomSheetFooter>
        </BottomSheet>
      </Dropdown>,
    );

    const selectInput = getByLabelText('Fruits') as HTMLInputElement;
    const autoComplete = queryByTestId('fruits-autocomplete') as HTMLInputElement;
    expect(selectInput).toBeVisible();

    // testing library ignores the nodes because they are set to display none so using querySelector to select from dom instead.
    // the node becomes accessible after click on selectInput
    expect(queryByTestId('bottomsheet-body')).not.toBeVisible();
    await user.click(selectInput);
    await waitFor(() => expect(queryByTestId('bottomsheet-body')).toBeVisible());
    expect(autoComplete).toBeVisible();
    expect(container).toMatchSnapshot();
  });

  it('should handle AutoComplete behaviour in single select', async () => {
    const user = userEvent.setup();

    const { getByRole, queryByRole, getByLabelText, queryByTestId } = renderWithTheme(
      <Dropdown>
        <SelectInput testID="select" label="Cities" />
        <BottomSheet>
          <BottomSheetHeader>
            <AutoComplete label="Cities" placeholder="Select Cities" testID="cities-autocomplete" />
          </BottomSheetHeader>
          <BottomSheetBody>
            <ActionList>
              <ActionListItem title="Mumbai" value="mumbai" />
              <ActionListItem title="Bangalore" value="bangalore" />
              <ActionListItem title="Ooty" value="ooty" />
              <ActionListItem title="Pune" value="pune" />
            </ActionList>
          </BottomSheetBody>
        </BottomSheet>
      </Dropdown>,
    );

    const selectInput = getByLabelText('Cities') as HTMLInputElement;
    const autoComplete = queryByTestId('cities-autocomplete') as HTMLInputElement;
    expect(selectInput).toBeVisible();

    expect(queryByTestId('bottomsheet-body')).not.toBeVisible();
    await user.click(selectInput);
    await waitFor(() => expect(queryByTestId('bottomsheet-body')).toBeVisible());

    // // All elements should be visible
    expect(getByRole('option', { name: 'Pune' })).toBeVisible();
    expect(getByRole('option', { name: 'Mumbai' })).toBeVisible();

    // // Start typing to filter, only filtered elements should be visible

    act(() => {
      autoComplete.focus();
    });
    await user.keyboard('m');
    expect(queryByRole('option', { name: 'Pune' })).toBeFalsy();
    expect(getByRole('option', { name: 'Mumbai' })).toBeVisible();

    await user.click(getByRole('option', { name: 'Mumbai' }));

    await waitFor(() => expect(queryByTestId('bottomsheet-body')).not.toBeVisible());
    expect(selectInput.value).toBe('Mumbai');
  }, 10000);

  // Flaky test. Skipping for now. Should be replicated into E2E eventually
  it.skip('should handle AutoComplete behaviour in multiselect', async () => {
    const user = userEvent.setup();
    const { queryByTestId, getByLabelText, getByRole } = renderWithTheme(
      <Dropdown selectionType="multiple">
        <SelectInput label="Fruits" placeholder="Select Fruits" />
        <BottomSheet>
          <BottomSheetHeader>
            <AutoComplete label="Fruits" placeholder="Select Fruits" testID="fruits-autocomplete" />
          </BottomSheetHeader>
          <BottomSheetBody>
            <ActionList>
              <ActionListItem title="Apple" value="apple" />
              <ActionListItem title="Mango" value="mango" />
              <ActionListItem title="Orange" value="orange" />
            </ActionList>
          </BottomSheetBody>
        </BottomSheet>
      </Dropdown>,
    );

    const selectInput = getByLabelText('Fruits') as HTMLInputElement;
    const autoComplete = queryByTestId('fruits-autocomplete') as HTMLInputElement;
    expect(selectInput).toBeVisible();

    expect(queryByTestId('bottomsheet-body')).not.toBeVisible();
    await user.click(selectInput);
    await waitFor(() => expect(queryByTestId('bottomsheet-body')).toBeVisible());

    act(() => {
      autoComplete.focus();
    });
    await user.keyboard('m');
    expect(getByRole('option', { name: 'Mango' })).toBeVisible();
    await user.click(getByRole('option', { name: 'Mango' }));
    expect(getTag('Mango')).toBeVisible();
    expect(getByRole('option', { name: 'Mango' })).toBeVisible();
    expect(autoComplete.value).toBeFalsy();
    expect(queryByTestId('bottomsheet-body')).toBeVisible();

    await user.keyboard('o');
    await user.click(getByRole('option', { name: 'Orange' }));
    expect(getTag('Orange')).toBeVisible();
    expect(getTag('Mango')).toBeVisible();

    // Close on tag click
    await user.click(getTag('Orange'));
    await waitFor(() => expect(getTag('Orange')).not.toBeVisible());
    expect(getTag('Mango')).toBeVisible();
  });

  it('it should accept data-analytics attributes', async () => {
    const { getByRole, container } = renderWithTheme(
      <Dropdown>
        <AutoComplete label="Fruits" data-analytics-name="dropdown-fruits" />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Apple" value="apple" data-analytics-value="apple" />
            <ActionListItem title="Mango" value="mango" data-analytics-value="mango" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );
    expect(container).toMatchSnapshot();
    const selectInput = getByRole('combobox', { name: 'Fruits' });
    expect(selectInput).toHaveAttribute('data-analytics-name', 'dropdown-fruits');
    // you need to click on selectInput to make the list visible
    await userEvent.click(selectInput);
    expect(getByRole('option', { name: 'Apple' })).toHaveAttribute('data-analytics-value', 'apple');
    expect(getByRole('option', { name: 'Mango' })).toHaveAttribute('data-analytics-value', 'mango');
  });

  it('should handle controlled filtering', async () => {
    const cities = [
      {
        title: 'Mumbai',
        value: 'mumbai',
        keywords: ['maharashtra'],
      },
      {
        title: 'Pune',
        value: 'pune',
        keywords: ['maharashtra'],
      },
      {
        title: 'Bengaluru',
        value: 'bengaluru',
        keywords: ['karnataka', 'bangalore'],
      },
    ];

    const ControlledFiltering = (): React.ReactElement => {
      const cityValues = cities.map((city) => city.value);
      const [filteredValues, setFilteredValues] = React.useState<string[]>(cityValues);

      return (
        <Dropdown selectionType="multiple">
          <SelectInput label="Cities" />
          <BottomSheet>
            <BottomSheetHeader>
              <AutoComplete
                label="Cities"
                testID="cities-autocomplete"
                onInputValueChange={({ value }) => {
                  if (value) {
                    const filteredItems = cities
                      .filter(
                        (city) =>
                          city.title.toLowerCase().startsWith(value.toLowerCase()) ||
                          city.keywords.find((keyword) =>
                            keyword.toLowerCase().includes(value.toLowerCase()),
                          ),
                      )
                      .map((city) => city.value);

                    if (filteredItems.length > 0) {
                      setFilteredValues(filteredItems);
                    } else {
                      setFilteredValues([]);
                    }
                  } else {
                    setFilteredValues(cityValues);
                  }
                }}
                filteredValues={filteredValues}
                helpText="Try typing 'maharashtra' in input"
              />
            </BottomSheetHeader>
            <BottomSheetBody>
              <ActionList>
                {cities.map((city) => (
                  <ActionListItem key={city.value} title={city.title} value={city.value} />
                ))}
              </ActionList>
            </BottomSheetBody>
          </BottomSheet>
        </Dropdown>
      );
    };

    const user = userEvent.setup();
    const { getByRole, getByLabelText, queryByRole, queryByTestId } = renderWithTheme(
      <ControlledFiltering />,
    );

    const selectInput = getByLabelText('Cities') as HTMLInputElement;
    const autoComplete = queryByTestId('cities-autocomplete') as HTMLInputElement;

    expect(selectInput).toBeInTheDocument();
    expect(queryByTestId('bottomsheet-body')).not.toBeVisible();

    await user.click(selectInput);
    await waitFor(() => expect(queryByTestId('bottomsheet-body')).toBeVisible());

    act(() => {
      autoComplete.focus();
    });

    expect(getByRole('option', { name: 'Mumbai' })).toBeVisible();
    expect(getByRole('option', { name: 'Pune' })).toBeVisible();
    expect(getByRole('option', { name: 'Bengaluru' })).toBeVisible();

    // typing maharashtra should filter mumbai and pune and remove other options
    await user.keyboard('maha');

    expect(getByRole('option', { name: 'Mumbai' })).toBeVisible();
    expect(getByRole('option', { name: 'Pune' })).toBeVisible();
    expect(queryByRole('option', { name: 'Bengaluru' })).not.toBeInTheDocument();

    expect(getByRole('option', { name: 'Pune' })).toHaveAttribute('aria-selected', 'false');
    await user.click(getByRole('option', { name: 'Pune' }));
    expect(getByRole('option', { name: 'Pune' })).toHaveAttribute('aria-selected', 'true');
  }, 10000);
  it('should fire native events like input and change', async () => {
    const cities = [
      {
        title: 'Mumbai',
        value: 'mumbai',
        keywords: ['maharashtra'],
      },
      {
        title: 'Pune',
        value: 'pune',
        keywords: ['maharashtra'],
      },
      {
        title: 'Bengaluru',
        value: 'bengaluru',
        keywords: ['karnataka', 'bangalore'],
      },
    ];
    const handleInput = jest.fn();
    const handleChange = jest.fn();

    const ControlledFiltering = (): React.ReactElement => {
      const cityValues = cities.map((city) => city.value);
      const [filteredValues, setFilteredValues] = React.useState<string[]>(cityValues);
      const ref = React.useRef<HTMLElement>(null);

      useEffect(() => {
        if (ref?.current) {
          ref.current.addEventListener('input', () => {
            handleInput();
          });
          ref.current.addEventListener('change', () => {
            handleChange();
          });
        }
        return () => {
          if (ref?.current) {
            ref.current.removeEventListener('input', () => {
              handleInput();
            });
            ref.current.removeEventListener('change', () => {
              handleChange();
            });
          }
        };
      }, []);

      return (
        <Box ref={ref}>
          <Dropdown selectionType="multiple">
            <SelectInput label="Cities" />
            <BottomSheet>
              <BottomSheetHeader>
                <AutoComplete
                  label="Cities"
                  testID="cities-autocomplete"
                  onInputValueChange={({ value }) => {
                    if (value) {
                      const filteredItems = cities
                        .filter(
                          (city) =>
                            city.title.toLowerCase().startsWith(value.toLowerCase()) ||
                            city.keywords.find((keyword) =>
                              keyword.toLowerCase().includes(value.toLowerCase()),
                            ),
                        )
                        .map((city) => city.value);

                      if (filteredItems.length > 0) {
                        setFilteredValues(filteredItems);
                      } else {
                        setFilteredValues([]);
                      }
                    } else {
                      setFilteredValues(cityValues);
                    }
                  }}
                  filteredValues={filteredValues}
                  helpText="Try typing 'maharashtra' in input"
                />
              </BottomSheetHeader>
              <BottomSheetBody>
                <ActionList>
                  {cities.map((city) => (
                    <ActionListItem key={city.value} title={city.title} value={city.value} />
                  ))}
                </ActionList>
              </BottomSheetBody>
            </BottomSheet>
          </Dropdown>
        </Box>
      );
    };

    const user = userEvent.setup();
    const { getByRole, getByLabelText, queryByTestId } = renderWithTheme(<ControlledFiltering />);

    const selectInput = getByLabelText('Cities') as HTMLInputElement;
    const autoComplete = queryByTestId('cities-autocomplete') as HTMLInputElement;

    expect(selectInput).toBeInTheDocument();
    expect(queryByTestId('bottomsheet-body')).not.toBeVisible();

    await user.click(selectInput);
    await waitFor(() => expect(queryByTestId('bottomsheet-body')).toBeVisible());

    act(() => {
      autoComplete.focus();
    });

    expect(getByRole('option', { name: 'Mumbai' })).toBeVisible();
    expect(getByRole('option', { name: 'Pune' })).toBeVisible();
    expect(getByRole('option', { name: 'Bengaluru' })).toBeVisible();

    await user.click(getByRole('option', { name: 'Pune' }));
    expect(handleInput).toBeCalled();
    expect(handleChange).toBeCalled();
  }, 10000);
});
