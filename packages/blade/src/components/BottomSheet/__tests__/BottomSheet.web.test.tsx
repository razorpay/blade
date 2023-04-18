/* eslint-disable no-global-assign */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import userEvents from '@testing-library/user-event';
import { mockViewport } from 'jsdom-testing-mocks';
import { BottomSheet, BottomSheetHeader, BottomSheetBody, BottomSheetFooter } from '../BottomSheet';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';
import { Text } from '~components/Typography';
import { Button } from '~components/Button';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
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
        <Dropdown selectionType="multiple">
          <SelectInput
            label="Select Action"
            onChange={({ name, values }) => {
              console.log(name, values);
            }}
          />
          <DropdownOverlay>
            <BottomSheet>
              <BottomSheetBody>
                <SingleSelectContent />
              </BottomSheetBody>
            </BottomSheet>
          </DropdownOverlay>
        </Dropdown>
      );
    };
    const { queryByTestId, getByRole } = renderWithTheme(<Example />);

    // open / close by clicking the select
    expect(queryByTestId('bottomsheet-body')).not.toBeInTheDocument();
    expect(getByRole('combobox', { name: 'Select Action' })).toBeInTheDocument();
    await user.click(getByRole('combobox', { name: 'Select Action' }));
    expect(queryByTestId('bottomsheet-body')).toBeInTheDocument();
    await user.click(queryByTestId('bottomsheet-backdrop')!);
    await sleep(250);
    expect(queryByTestId('bottomsheet-body')).not.toBeInTheDocument();

    // close by selecting an element & assert the select's value

    // check that cancelling should not update select's value
  });

  viewport.cleanup();
});
