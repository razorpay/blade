import React from 'react';
import { renderWithTheme } from '../../../_helpers/testing';
import Icon from '../index';

describe('<Icon />', () => {
  describe('size', () => {
    it('should render a medium icon', () => {
      const { container } = renderWithTheme(<Icon size="medium" name="info" />);
      expect(container).toMatchSnapshot();
    });
    it('should render a small icon', () => {
      const { container } = renderWithTheme(<Icon size="small" name="info" />);
      expect(container).toMatchSnapshot();
    });
  });
  describe('fill', () => {
    it('should render a color filled icon', () => {
      const { container } = renderWithTheme(<Icon fill="shade.980" name="info" />);
      expect(container).toMatchSnapshot();
    });
  });
});
