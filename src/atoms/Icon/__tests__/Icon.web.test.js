import React from 'react';
import { renderWithTheme } from '../../../_helpers/testing';
import Icon from '../index';

describe('<Icon />', () => {
  describe('size', () => {
    it('name', () => {
      const { container } = renderWithTheme(<Icon size="medium" name="info" />);
      expect(container).toMatchSnapshot();
    });
  });
});
