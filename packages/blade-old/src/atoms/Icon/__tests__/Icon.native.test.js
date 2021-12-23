import React from 'react';
import { Path } from 'react-native-svg';
import { renderWithTheme } from '../../../_helpers/testing';
import Icon from '../index';

describe('Renders <Icon /> correctly', () => {
  it('snapshot testing', () => {
    const { container } = renderWithTheme(
      <Icon viewBox="0 0 24 24">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 6a3 3 0 013-3h18a3 3 0 013 3v12a3 3 0 01-3 3H3a3 3 0 01-3-3V6zm2 0a1 1 0 011-1h18a1 1 0 011 1v3H2V6zm20 5v7a1 1 0 01-1 1H3a1 1 0 01-1-1v-7h20z"
        />
      </Icon>,
    );
    expect(container).toMatchSnapshot();
  });
});
