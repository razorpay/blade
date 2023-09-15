import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { Dropdown, DropdownOverlay, DropdownFooter } from '~components/Dropdown';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { AutoComplete } from '~components/Input/DropdownInputTriggers';
import { ActionList, ActionListItem } from '~components/ActionList';
import { Button } from '~components/Button';

describe('<Dropdown /> with <AutoComplete />', () => {
  it('should render AutoComplete', () => {
    const applyClickHandler = jest.fn();

    const { getByRole, getByTestId, toJSON, queryAllByRole } = renderWithTheme(
      <Dropdown selectionType="multiple">
        <AutoComplete name="fruits" label="Select Fruit" />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Mango" value="mango" />
            <ActionListItem title="Apple" value="apple" />
            <ActionListItem title="Banana" value="banana" />
          </ActionList>
          <DropdownFooter>
            <Button onClick={applyClickHandler}>Apply</Button>
          </DropdownFooter>
        </DropdownOverlay>
      </Dropdown>,
    );

    expect(getByTestId('dropdown-overlay').props.display).toBe('none');
    expect(queryAllByRole('menuitem')[1]).toBeFalsy();

    // Click on combobox
    fireEvent.press(getByRole('combobox'));
    fireEvent.changeText(getByRole('combobox'), '');

    // filtering test
    expect(getByRole('menuitem', { name: 'Apple' })).toHaveStyle({ display: 'flex' });

    expect(toJSON()).toMatchSnapshot();
  });

  it('should be able to select multiple items with multiselect', () => {
    const applyClickHandler = jest.fn();

    const {
      getByRole,
      getByTestId,
      queryByLabelText,
      getByLabelText,
      queryAllByRole,
    } = renderWithTheme(
      <Dropdown selectionType="multiple">
        <AutoComplete name="fruits" label="Select Fruit" />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Mango" value="mango" />
            <ActionListItem title="Apple" value="apple" />
            <ActionListItem title="Banana" value="banana" />
          </ActionList>
          <DropdownFooter>
            <Button onClick={applyClickHandler}>Apply</Button>
          </DropdownFooter>
        </DropdownOverlay>
      </Dropdown>,
    );

    expect(getByTestId('dropdown-overlay').props.display).toBe('none');
    expect(queryAllByRole('menuitem')[1]).toBeFalsy();

    // Click on combobox
    fireEvent.press(getByRole('combobox'));
    fireEvent.changeText(getByRole('combobox'), '');

    // filtering test
    fireEvent.changeText(getByRole('combobox'), 'app');
    expect(getByRole('menuitem', { name: 'Apple' })).toHaveStyle({ display: 'flex' });
    expect(getByRole('menuitem', { name: 'Mango' })).toHaveStyle({ display: 'none' });

    fireEvent.changeText(getByRole('combobox'), '');
    // Click on item
    expect(getByRole('menuitem', { name: 'Apple' })).toHaveStyle({ display: 'flex' });
    fireEvent.press(getByRole('menuitem', { name: 'Apple' }));
    expect(getByLabelText('Close Apple tag')).toBeOnTheScreen();

    // Click another item
    fireEvent.press(getByRole('menuitem', { name: 'Banana' }));
    expect(getByLabelText('Close Apple tag')).toBeOnTheScreen();
    expect(getByLabelText('Close Banana tag')).toBeOnTheScreen();
    expect(queryByLabelText('Close Mango tag')).toBeFalsy();

    // Ensure overlay is still visible
    expect(getByTestId('dropdown-overlay').props.display).toBe('flex');

    // Apply button click
    fireEvent.press(getByRole('button', { name: 'Apply' }));
    expect(applyClickHandler).toBeCalled();

    // Click outside
    fireEvent.press(getByTestId('closeable-area'));
    expect(getByTestId('dropdown-overlay').props.display).toBe('none');
  });

  it('should handle controlled filtering', () => {
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

    const { getByRole, queryByRole, getAllByRole, getByLabelText } = renderWithTheme(
      <ControlledFiltering />,
    );

    const selectInput = getByRole('combobox');

    expect(selectInput).toBeOnTheScreen();
    expect(queryByRole('listbox')).toBeNull();

    fireEvent.press(selectInput);
    fireEvent.changeText(selectInput, '');

    expect(getAllByRole('menuitem')[1]).toBeOnTheScreen();
    fireEvent.changeText(selectInput, 'banga');
    expect(getByRole('menuitem', { name: 'Mumbai' })).toHaveStyle({ display: 'none' });
    expect(getByRole('menuitem', { name: 'Bengaluru' })).toHaveStyle({ display: 'flex' });

    fireEvent.press(getByRole('menuitem', { name: 'Bengaluru' }));
    expect(getByLabelText('Close Bengaluru tag')).toBeOnTheScreen();
  });
});
