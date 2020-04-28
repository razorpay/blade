import React from 'react';
import { fireEvent } from '@testing-library/react';
import Link from '../index';
import { renderWithTheme } from '../../../_helpers/testing';

describe('<Link />', () => {
  describe('Size', () => {
    it('small', () => {
      const displayText = 'Displaying some link';
      const { container } = renderWithTheme(<Link size="small">{displayText}</Link>);
      expect(container).toMatchSnapshot();
    });

    it('medium', () => {
      const displayText = 'Displaying some link';
      const { container } = renderWithTheme(<Link size="medium">{displayText}</Link>);
      expect(container).toMatchSnapshot();
    });

    it('large', () => {
      const displayText = 'Displaying some link';
      const { container } = renderWithTheme(<Link size="large">{displayText}</Link>);
      expect(container).toMatchSnapshot();
    });
  });
  describe('Selectors', () => {
    it('hover', () => {
      const displayText = 'Displaying some link';
      const mockOnPress = jest.fn();
      const { getByText } = renderWithTheme(<Link>{displayText}</Link>);
      const link = getByText(displayText).parentNode;
      fireEvent.mouseOver(link);
      expect(mockOnPress).toMatchSnapshot();
    });
    it('focus', () => {
      const displayText = 'Displaying some link';
      const mockOnPress = jest.fn();
      const { getByText } = renderWithTheme(<Link>{displayText}</Link>);
      const link = getByText(displayText).parentNode;
      fireEvent.focus(link);
      expect(mockOnPress).toMatchSnapshot();
    });
    it('active', () => {
      const displayText = 'Displaying some link';
      const mockOnPress = jest.fn();
      const { getByText } = renderWithTheme(<Link>{displayText}</Link>);
      const link = getByText(displayText).parentNode;
      fireEvent.click(link);
      expect(mockOnPress).toMatchSnapshot();
    });
  });
  describe('various link props', () => {
    it('renders a link with default props', () => {
      const displayText = 'Displaying some link';
      const { container } = renderWithTheme(<Link>{displayText}</Link>);
      expect(container).toMatchSnapshot();
    });
    it('renders a link with disabled prop', () => {
      const displayText = 'Displaying some link';
      const { container } = renderWithTheme(<Link disabled>{displayText}</Link>);
      expect(container).toMatchSnapshot();
    });
    it('href', () => {
      const displayText = 'Displaying some link';
      const { container } = renderWithTheme(
        <Link size="large" href="https://www.razorpay.com">
          {displayText}
        </Link>,
      );
      expect(container).toMatchSnapshot();
    });
    it('target', () => {
      const displayText = 'Displaying some link';
      const { container } = renderWithTheme(
        <Link size="large" href="https://www.razorpay.com" target="_blank">
          {displayText}
        </Link>,
      );
      expect(container).toMatchSnapshot();
    });
    it('rel', () => {
      const displayText = 'Displaying some link';
      const { container } = renderWithTheme(
        <Link
          size="large"
          href="https://www.razorpay.com"
          target="_blank"
          rel="noreferrer noopener"
        >
          {displayText}
        </Link>,
      );
      expect(container).toMatchSnapshot();
    });
  });
});
