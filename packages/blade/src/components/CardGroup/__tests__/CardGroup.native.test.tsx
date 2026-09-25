import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import {
  CardGroup,
  CardGroupItem,
  CardGroupCollapsibleItem,
  CardGroupCollapsibleItemBody,
} from '../';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { Text } from '~components/Typography';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<CardGroup />', () => {
  it('renders a group of rows', () => {
    const { toJSON, getByText } = renderWithTheme(
      <CardGroup accessibilityLabel="Payment methods">
        <CardGroupItem href="/cards">
          <Text>Cards</Text>
        </CardGroupItem>
        <CardGroupItem onClick={jest.fn()}>
          <Text>Wallet</Text>
        </CardGroupItem>
      </CardGroup>,
    );
    expect(getByText('Cards')).toBeTruthy();
    expect(getByText('Wallet')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('fires onClick on a selecting row', () => {
    const onClick = jest.fn();
    const { getByText } = renderWithTheme(
      <CardGroup>
        <CardGroupItem onClick={onClick}>
          <Text>Wallet</Text>
        </CardGroupItem>
      </CardGroup>,
    );
    fireEvent.press(getByText('Wallet'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('toggles a collapsible trigger on press', () => {
    const onExpandChange = jest.fn();
    const { getByText } = renderWithTheme(
      <CardGroup>
        <CardGroupCollapsibleItem onExpandChange={onExpandChange}>
          <CardGroupItem>
            <Text>UPI</Text>
          </CardGroupItem>
          <CardGroupCollapsibleItemBody>
            <Text>Google Pay</Text>
          </CardGroupCollapsibleItemBody>
        </CardGroupCollapsibleItem>
      </CardGroup>,
    );
    fireEvent.press(getByText('UPI'));
    expect(onExpandChange).toHaveBeenCalledWith({ isExpanded: true });
  });
});
