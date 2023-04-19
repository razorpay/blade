/* eslint-disable no-global-assign */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import userEvents from '@testing-library/user-event';
import { mockViewport } from 'jsdom-testing-mocks';
import { within } from '@testing-library/react';
import { BottomSheet, BottomSheetHeader, BottomSheetBody, BottomSheetFooter } from '../BottomSheet';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';
import { Text } from '~components/Typography';
import { Button } from '~components/Button';
import { Dropdown } from '~components/Dropdown';
import { SelectInput } from '~components/Input/SelectInput';
import { ActionList, ActionListItem } from '~components/ActionList';

export const sleep = (delay = 10): Promise<number> =>
  new Promise((resolve) => setTimeout(resolve, delay));

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

  it('should open/close BottomSheet', async () => {
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
            <BottomSheetFooter
              title="Footer Title"
              trailing={{
                primary: { text: 'Apply' },
                secondary: { text: 'Cancel' },
              }}
            />
          </BottomSheet>
        </>
      );
    };
    const { getByText, queryByTestId } = renderWithTheme(<Example />);

    expect(queryByTestId('bottomsheet-body')).not.toBeInTheDocument();
    await user.click(getByText(/open/i));
    expect(queryByTestId('bottomsheet-body')).toBeInTheDocument();
    await user.click(queryByTestId('bottomsheet-backdrop')!);
    await sleep(250);
    expect(queryByTestId('bottomsheet-body')).not.toBeInTheDocument();
  });

  it('should close with close button', async () => {
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
            <BottomSheetFooter
              title="Footer Title"
              trailing={{
                primary: { text: 'Apply' },
                secondary: { text: 'Cancel' },
              }}
            />
          </BottomSheet>
        </>
      );
    };

    const { getByText, getByRole, queryByTestId } = renderWithTheme(<Example />);

    expect(queryByTestId('bottomsheet-body')).not.toBeInTheDocument();
    await user.click(getByText(/open/i));
    expect(queryByTestId('bottomsheet-body')).toBeInTheDocument();
    await user.click(getByRole('button', { name: /Close bottomsheet/i })!);
    await sleep(250);
    expect(queryByTestId('bottomsheet-body')).not.toBeInTheDocument();
  });

  it('should work with initial state as open', () => {
    const Example = (): React.ReactElement => {
      return (
        <BottomSheet isOpen={true}>
          <BottomSheetBody>
            <Text>BottomSheet body</Text>
          </BottomSheetBody>
        </BottomSheet>
      );
    };
    const { queryByTestId } = renderWithTheme(<Example />);
    expect(queryByTestId('bottomsheet-body')).toBeInTheDocument();
  });

  it('should compose with Dropdown single select', async () => {
    const user = userEvents.setup();

    const Example = (): React.ReactElement => {
      return (
        <Dropdown selectionType="single">
          <SelectInput
            label="Select Action"
            onChange={({ name, values }) => {
              console.log(name, values);
            }}
          />
          <BottomSheet>
            <BottomSheetBody>
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
    await sleep(250);
    expect(queryByTestId('bottomsheet-body')).toBeVisible();
    await user.click(queryByTestId('bottomsheet-backdrop')!);
    expect(queryByTestId('bottomsheet-body')).not.toBeVisible();

    // close by selecting an element & assert the select's value
    await user.click(getByRole('combobox', { name: 'Select Action' }));
    await sleep(250);
    expect(queryByTestId('bottomsheet-body')).toBeVisible();
    await user.click(getByRole('option', { name: 'Settings' }));
    expect(getByRole('combobox', { name: 'Select Action' })).toHaveTextContent('Settings');
    expect(queryByTestId('bottomsheet-body')).not.toBeVisible();

    // check that cancelling should not update select's value
    await user.click(getByRole('combobox', { name: 'Select Action' }));
    await sleep(250);
    expect(queryByTestId('bottomsheet-body')).toBeVisible();
    await user.click(getByRole('button', { name: /Close bottomsheet/i })!);
    expect(getByRole('combobox', { name: 'Select Action' })).toHaveTextContent('Settings');
    expect(queryByTestId('bottomsheet-body')).not.toBeVisible();
  });

  it('should compose with Dropdown multi select', async () => {
    const user = userEvents.setup();

    const Example = (): React.ReactElement => {
      return (
        <Dropdown selectionType="multiple">
          <SelectInput
            label="Select Fruit"
            onChange={({ name, values }) => {
              console.log(name, values);
            }}
          />
          <BottomSheet>
            <BottomSheetBody>
              <MultiSelectContent />
            </BottomSheetBody>
          </BottomSheet>
        </Dropdown>
      );
    };
    const { queryByTestId, getByRole } = renderWithTheme(<Example />);

    const selectInput = getByRole('combobox', { name: 'Select Fruit' });

    // open the dropdown
    expect(queryByTestId('bottomsheet-body')).not.toBeVisible();
    expect(selectInput).toBeInTheDocument();
    await user.click(selectInput);
    await sleep(250);
    expect(queryByTestId('bottomsheet-body')).toBeVisible();

    // assert no items selected
    expect(selectInput).toHaveTextContent('Select Option');

    // select multiple elements
    await user.click(getByRole('option', { name: 'Apple' }));
    expect(selectInput).toHaveTextContent('Apple');
    await user.click(getByRole('option', { name: 'Orange' }));
    expect(selectInput).toHaveTextContent('2 items selected');
    await user.click(getByRole('option', { name: 'Banana' }));
    expect(selectInput).toHaveTextContent('3 items selected');

    // close the sheet
    await user.click(getByRole('button', { name: /Close bottomsheet/i })!);
    expect(queryByTestId('bottomsheet-body')).not.toBeVisible();

    // asssert the selected items
    expect(selectInput).toHaveTextContent('3 items selected');

    // open again and ensure the previously selected elements are there
    await user.click(selectInput);
    await sleep(250);
    expect(queryByTestId('bottomsheet-body')).toBeVisible();
    expect(selectInput).toHaveTextContent('3 items selected');
    expect(
      within(getByRole('option', { name: 'Apple' })).getByRole('checkbox', { hidden: true }),
    ).toBeChecked();
    expect(
      within(getByRole('option', { name: 'Orange' })).getByRole('checkbox', { hidden: true }),
    ).toBeChecked();
    expect(
      within(getByRole('option', { name: 'Banana' })).getByRole('checkbox', { hidden: true }),
    ).toBeChecked();
    expect(
      within(getByRole('option', { name: 'Avocado' })).getByRole('checkbox', { hidden: true }),
    ).not.toBeChecked();
  });

  viewport.cleanup();
});
