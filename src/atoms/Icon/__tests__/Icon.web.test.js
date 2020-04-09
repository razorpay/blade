import React from 'react';
import { renderWithTheme } from '../../../_helpers/testing';
import Icon from '../index';

describe('<Icon />', () => {
  describe('size', () => {
    it('renders a medium icon', () => {
      const { container } = renderWithTheme(<Icon size="medium" name="info" />);
      expect(container).toMatchSnapshot();
    });
    it('renders a small icon', () => {
      const { container } = renderWithTheme(<Icon size="small" name="info" />);
      expect(container).toMatchSnapshot();
    });
  });
  describe('fill', () => {
    it('renders a color filled icon', () => {
      const { container } = renderWithTheme(<Icon fill="shade.980" name="info" />);
      expect(container).toMatchSnapshot();
    });
  });
});
