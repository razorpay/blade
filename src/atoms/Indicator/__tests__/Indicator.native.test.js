import React from 'react';
import Indicator from '../index';
import { renderWithTheme } from '../../../_helpers/testing';

describe('<Indicator />', () => {
  describe('fill', () => {
    it('renders a solid Indicator', () => {
      const { container } = renderWithTheme(<Indicator />);
      expect(container).toMatchSnapshot();
    });

    it('renders an empty Indicator', () => {
      const { container } = renderWithTheme(<Indicator fill="empty" />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('variant', () => {
    it('renders a positive Indicator', () => {
      const { container } = renderWithTheme(<Indicator variant="positive" />);
      expect(container).toMatchSnapshot();
    });

    it('renders a negative Indicator', () => {
      const { container } = renderWithTheme(<Indicator variant="negative" />);
      expect(container).toMatchSnapshot();
    });

    it('renders a warning Indicator', () => {
      const { container } = renderWithTheme(<Indicator variant="warning" />);
      expect(container).toMatchSnapshot();
    });

    it('renders a neutral Indicator', () => {
      const { container } = renderWithTheme(<Indicator />);
      expect(container).toMatchSnapshot();
    });

    it('renders a positive empty Indicator', () => {
      const { container } = renderWithTheme(<Indicator fill="empty" variant="positive" />);
      expect(container).toMatchSnapshot();
    });
  });
});
