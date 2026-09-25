import React from 'react';
import {
  CardGroup,
  CardGroupItem,
  CardGroupCollapsibleItem,
  CardGroupCollapsibleItemBody,
} from '../';
import renderWithSSR from '~utils/testing/renderWithSSR.web';
import { Text } from '~components/Typography';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<CardGroup /> SSR', () => {
  it('server-renders the group and its rows', () => {
    const { getByText, container } = renderWithSSR(
      <CardGroup accessibilityLabel="Payment methods">
        <CardGroupItem href="/cards">
          <Text>Cards</Text>
        </CardGroupItem>
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
    expect(getByText('Cards')).toBeInTheDocument();
    expect(getByText('UPI')).toBeInTheDocument();
    expect(getByText('Google Pay')).toBeInTheDocument();
    expect(container.querySelector('a[href="/cards"]')).toBeInTheDocument();
  });
});
