import React from 'react';
import { renderWithTheme } from '../../../_helpers/testing';
import TextArea from '../index';

describe('<TextArea />', () => {
  describe('variant', () => {
    it('renders outlined variant with default props', () => {
      const { container } = renderWithTheme(<TextArea variant="outlined" />);
      expect(container).toMatchSnapshot();
    });

    it('renders filled variant with default props', () => {
      const { container } = renderWithTheme(<TextArea variant="filled" />);
      expect(container).toMatchSnapshot();
    });
  });
});
