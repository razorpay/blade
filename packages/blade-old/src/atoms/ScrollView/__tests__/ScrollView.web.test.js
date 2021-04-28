import React from 'react';
import { renderWithTheme } from '../../../_helpers/testing';
import ScrollView from '../index';
import Text from '../../Text';

describe('<ScrollView />', () => {
  it('should render Text in scroll view', () => {
    const { container } = renderWithTheme(
      <ScrollView>
        <Text>Hello World</Text>
      </ScrollView>,
    );
    expect(container).toMatchSnapshot();
  });
});
