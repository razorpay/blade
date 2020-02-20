import React from 'react';
import { renderWithTheme } from '../../../_helpers/testing';
import Icon from '../index';

describe('Renders <Icon /> correctly', () => {
  it('snapshot testing', () => {
    const { container } = renderWithTheme(<Icon name="info" />);
    expect(container).toMatchSnapshot();
  });
});
