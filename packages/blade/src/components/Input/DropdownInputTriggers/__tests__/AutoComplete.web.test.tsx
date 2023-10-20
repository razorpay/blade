import React from 'react';
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
  });

  it('should handle AutoComplete behaviour in multiselect', async () => {
    const user = userEvent.setup();
    const { queryByRole, getByRole } = renderWithTheme(
      <Dropdown selectionType="multiple">
        <AutoComplete label="Fruits" />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Apple" value="apple" />
            <ActionListItem title="Mango" value="mango" />
            <ActionListItem title="Orange" value="orange" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    const selectInput = getByRole('combobox', { name: 'Fruits' }) as HTMLInputElement;

    expect(selectInput).toBeInTheDocument();
    expect(queryByRole('listbox')).toBeNull();

    await user.click(selectInput);
    await waitFor(() => expect(getByRole('listbox', { name: 'Fruits' })).toBeVisible());

    await user.keyboard('m');
    await user.keyboard('{ENTER}');
    expect(getTag('Mango')).toBeVisible();
    expect(getByRole('option', { name: 'Mango' })).toBeVisible();
    expect(selectInput.value).toBe('');
    expect(getByRole('listbox', { name: 'Fruits' })).toBeVisible();

    await user.keyboard('o');
    await user.click(getByRole('option', { name: 'Orange' }));
    expect(getTag('Orange')).toBeVisible();
    expect(getTag('Mango')).toBeVisible();

    // Close on tag click
    await user.click(getTag('Orange'));
    await waitFor(() => expect(getTag('Orange')).not.toBeVisible());
    expect(getTag('Mango')).toBeVisible();
  });

  // Controlled AutoComplete
  it('should handle controlled selection', async () => {
    const ControlledDropdown = (): React.ReactElement => {
      const [currentSelection, setCurrentSelection] = React.useState<string[]>([]);

      return (
        <>
          <Button
            onClick={() => {
              if (!currentSelection.includes('bangalore')) {
                setCurrentSelection([...currentSelection, 'bangalore']);
              }
            }}
          >
            Select Bangalore
          </Button>
          <Dropdown selectionType="multiple">
            <AutoComplete
              label="Select City"
              value={currentSelection}
              onChange={(args) => {
                if (args) {
                  setCurrentSelection(args.values);
                }
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

    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 500 });

    const user = userEvent.setup();
    const { getByRole } = renderWithTheme(<ControlledDropdown />);

    const selectInput = getByRole('combobox', { name: 'Select City' });
    expect(getTag('Bangalore')).toBeFalsy();
    await user.click(getByRole('button', { name: 'Select Bangalore' }));
    expect(getTag('Bangalore')).toBeVisible();

    await user.click(selectInput);
    await user.click(getByRole('option', { name: 'Pune' }));
    expect(getTag('Pune')).toBeInTheDocument();
    expect(getTag('Bangalore')).toBeInTheDocument();

    await user.click(getByRole('button', { name: 'Select Bangalore' }));

    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 0 });
  });

  it('should handle controlled single selection', async () => {
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
              onChange={(args) => {
                setCurrentSelection(args?.values[0]);
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

    await user.click(selectInput);
    await user.click(getByRole('option', { name: 'Pune' }));
    expect(selectInput).toHaveValue('Pune');

    await user.click(getByRole('button', { name: 'Clear Selection' }));
    expect(selectInput).toHaveValue('');
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
          <AutoComplete
            label="Cities"
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
          {filteredValues.length > 0 ? (
            <DropdownOverlay>
              <ActionList>
                {cities.map((city) => (
                  <ActionListItem key={city.value} title={city.title} value={city.value} />
                ))}
              </ActionList>
            </DropdownOverlay>
          ) : null}
        </Dropdown>
      );
    };

    const user = userEvent.setup();
    const { getByRole, queryByRole } = renderWithTheme(<ControlledFiltering />);

    const selectInput = getByRole('combobox', { name: 'Cities' }) as HTMLInputElement;

    expect(selectInput).toBeInTheDocument();
    expect(queryByRole('listbox')).toBeNull();

    await user.click(selectInput);
    act(() => {
      selectInput.focus();
    });
    await waitFor(() => expect(getByRole('listbox', { name: 'Cities' })).toBeVisible());
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
  });

  it('should handle AutoComplete behaviour in multiselect', async () => {
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
  });
});
