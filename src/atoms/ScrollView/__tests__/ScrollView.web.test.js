import React from 'react';
import { renderWithTheme } from '../../../_helpers/testing';
import ScrollView from '../index';
import Text from '../../Text';

describe('<ScrollView />', () => {
  it('renders Text', () => {
    const { container } = renderWithTheme(
      <ScrollView>
        <Text>Hello World</Text>
      </ScrollView>,
    );
    expect(container).toMatchSnapshot();
  });
});
