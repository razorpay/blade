import React from 'react';
import { fireEvent } from '@testing-library/react';
import {
  CardGroup,
  CardGroupItem,
  CardGroupCollapsibleItem,
  CardGroupCollapsibleItemBody,
} from '../';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Text } from '~components/Typography';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<CardGroup />', () => {
  it('renders the group with its accessible label', () => {
    const { getByRole } = renderWithTheme(
      <CardGroup accessibilityLabel="Payment methods">
        <CardGroupItem href="/cards">
          <Text>Cards</Text>
        </CardGroupItem>
      </CardGroup>,
    );
    expect(getByRole('group', { name: 'Payment methods' })).toBeInTheDocument();
  });

  it('renders a navigating row as a link with an href', () => {
    const { getByRole } = renderWithTheme(
      <CardGroup>
        <CardGroupItem href="/cards">
          <Text>Cards</Text>
        </CardGroupItem>
      </CardGroup>,
    );
    const link = getByRole('link', { name: 'Cards' });
    expect(link).toHaveAttribute('href', '/cards');
  });

  it('renders a selecting row as a button and fires onClick', () => {
    const onClick = jest.fn();
    const { getByRole } = renderWithTheme(
      <CardGroup>
        <CardGroupItem onClick={onClick}>
          <Text>Wallet</Text>
        </CardGroupItem>
      </CardGroup>,
    );
    fireEvent.click(getByRole('button', { name: 'Wallet' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick when disabled', () => {
    const onClick = jest.fn();
    const { getByRole } = renderWithTheme(
      <CardGroup>
        <CardGroupItem onClick={onClick} isDisabled>
          <Text>Wallet</Text>
        </CardGroupItem>
      </CardGroup>,
    );
    const button = getByRole('button', { name: 'Wallet' });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('acts as a collapsible trigger with aria-expanded that toggles on click', () => {
    const { getByRole } = renderWithTheme(
      <CardGroup>
        <CardGroupCollapsibleItem>
          <CardGroupItem>
            <Text>UPI</Text>
          </CardGroupItem>
          <CardGroupCollapsibleItemBody>
            <Text>Google Pay</Text>
          </CardGroupCollapsibleItemBody>
        </CardGroupCollapsibleItem>
      </CardGroup>,
    );
    const trigger = getByRole('button', { name: 'UPI' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('reflects defaultIsExpanded on the trigger', () => {
    const { getByRole } = renderWithTheme(
      <CardGroup>
        <CardGroupCollapsibleItem defaultIsExpanded>
          <CardGroupItem>
            <Text>UPI</Text>
          </CardGroupItem>
          <CardGroupCollapsibleItemBody>
            <Text>Google Pay</Text>
          </CardGroupCollapsibleItemBody>
        </CardGroupCollapsibleItem>
      </CardGroup>,
    );
    expect(getByRole('button', { name: 'UPI' })).toHaveAttribute('aria-expanded', 'true');
  });
});
