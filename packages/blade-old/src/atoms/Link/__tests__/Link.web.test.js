import React from 'react';
import { fireEvent } from '@testing-library/react';
import Link from '../index';
import { renderWithTheme } from '../../../_helpers/testing';

describe('<Link />', () => {
  describe('Size', () => {
    it('should render a small Link', () => {
      const displayText = 'Displaying some link';
      const { container } = renderWithTheme(<Link size="small">{displayText}</Link>);
      expect(container).toMatchSnapshot();
    });

    it('should render a medium Link', () => {
      const displayText = 'Displaying some link';
      const { container } = renderWithTheme(<Link size="medium">{displayText}</Link>);
      expect(container).toMatchSnapshot();
    });

    it('should render a large Link', () => {
      const displayText = 'Displaying some link';
      const { container } = renderWithTheme(<Link size="large">{displayText}</Link>);
      expect(container).toMatchSnapshot();
    });
  });
  describe('Selectors', () => {
    it('should render a Link with hover styles', () => {
      const displayText = 'Displaying some link';
      const mockOnPress = jest.fn();
      const { getByText } = renderWithTheme(<Link>{displayText}</Link>);
      const link = getByText(displayText).parentNode;
      fireEvent.mouseOver(link);
      expect(mockOnPress).toMatchSnapshot();
    });
    it('should render a Link with focus styles', () => {
      const displayText = 'Displaying some link';
      const mockOnPress = jest.fn();
      const { getByText } = renderWithTheme(<Link>{displayText}</Link>);
      const link = getByText(displayText).parentNode;
      fireEvent.focus(link);
      expect(mockOnPress).toMatchSnapshot();
    });
    it('should render a Link with active styles', () => {
      const displayText = 'Displaying some link';
      const mockOnPress = jest.fn();
      const { getByText } = renderWithTheme(<Link>{displayText}</Link>);
      const link = getByText(displayText).parentNode;
      fireEvent.click(link);
      expect(mockOnPress).toMatchSnapshot();
    });
  });
  describe('various Link props', () => {
    it('should render a Link with default props', () => {
      const displayText = 'Displaying some link';
      const { container } = renderWithTheme(<Link>{displayText}</Link>);
      expect(container).toMatchSnapshot();
    });
    it('should a render a Link with disabled prop', () => {
      const displayText = 'Displaying some link';
      const { container } = renderWithTheme(<Link disabled>{displayText}</Link>);
      expect(container).toMatchSnapshot();
    });
    it('should render a Link with href attr', () => {
      const displayText = 'Displaying some link';
      const { container } = renderWithTheme(
        <Link size="large" href="https://www.razorpay.com">
          {displayText}
        </Link>,
      );
      expect(container).toMatchSnapshot();
    });
    it('should reender a Link with target attr', () => {
      const displayText = 'Displaying some link';
      const { container } = renderWithTheme(
        <Link
         size="large"
         href="https://www.razorpay.com"
         target="_blank"
         rel="noreferrer noopener">
          {displayText}
        </Link>,
      );
      expect(container).toMatchSnapshot();
    });
    it('should render a Link with rel attribute', () => {
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
