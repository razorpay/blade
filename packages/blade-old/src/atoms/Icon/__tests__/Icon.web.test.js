import React from 'react';
import { renderWithTheme } from '../../../_helpers/testing';
import Icon from '../index';

const svgPath = (
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M0 6a3 3 0 013-3h18a3 3 0 013 3v12a3 3 0 01-3 3H3a3 3 0 01-3-3V6zm2 0a1 1 0 011-1h18a1 1 0 011 1v3H2V6zm20 5v7a1 1 0 01-1 1H3a1 1 0 01-1-1v-7h20z"
  />
);

describe('<Icon />', () => {
  describe('size', () => {
    it('should render a medium icon', () => {
      const { container } = renderWithTheme(<Icon size="medium">{svgPath}</Icon>);
      expect(container).toMatchSnapshot();
    });
    it('should render a small icon', () => {
      const { container } = renderWithTheme(<Icon size="small">{svgPath}</Icon>);
      expect(container).toMatchSnapshot();
    });
  });
  describe('fill', () => {
    it('should render a color filled icon', () => {
      const { container } = renderWithTheme(<Icon fill="shade.980">{svgPath}</Icon>);
      expect(container).toMatchSnapshot();
    });
  });
});
