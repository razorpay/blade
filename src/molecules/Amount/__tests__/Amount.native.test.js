import React from 'react';
import Amount from '../index';
import { renderWithTheme } from '../../../_helpers/testing';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Amount />', () => {
  describe('size', () => {
    it('renders amount with size medium', () => {
      const displayText = '1234.00';
      const { container } = renderWithTheme(<Amount size="medium">{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
    it('renders amount with size large', () => {
      const displayText = '1234.00';
      const { container } = renderWithTheme(<Amount size="large">{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
    it('renders amount with size xlarge', () => {
      const displayText = '1234.00';
      const { container } = renderWithTheme(<Amount size="xlarge">{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
    it('renders amount with size xxlarge', () => {
      const displayText = '1234.00';
      const { container } = renderWithTheme(<Amount size="xxlarge">{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
    it('renders amount with size xxxlarge', () => {
      const displayText = '1234.00';
      const { container } = renderWithTheme(<Amount size="xxxlarge">{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
  });

  describe('align', () => {
    it('renders amount with left align', () => {
      const displayText = '1234.00';
      const { container } = renderWithTheme(<Amount align="left">{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
    it('renders amount with center align', () => {
      const displayText = '1234.00';
      const { container } = renderWithTheme(<Amount align="center">{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
    it('renders amount with right align', () => {
      const displayText = '1234.00';
      const { container } = renderWithTheme(<Amount align="right">{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
  });

  describe('decimal formatting', () => {
    it('renders 3 digit amount with indian currency format', () => {
      const displayText = '123';
      const { container } = renderWithTheme(<Amount>{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
    it('renders 4 digit amount with indian currency format', () => {
      const displayText = '1234';
      const { container } = renderWithTheme(<Amount>{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
    it('renders 5 digit amount with indian currency format', () => {
      const displayText = '12345';
      const { container } = renderWithTheme(<Amount>{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
    it('renders 6 digit amount with indian currency format', () => {
      const displayText = '123456';
      const { container } = renderWithTheme(<Amount>{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
    it('renders 7 digit amount with indian currency format', () => {
      const displayText = '1234567';
      const { container } = renderWithTheme(<Amount>{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
    it('renders 8 digit amount with indian currency format', () => {
      const displayText = '12345678';
      const { container } = renderWithTheme(<Amount>{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
  });

  describe('fractional formatting', () => {
    it('renders 0 digit fractional part', () => {
      const displayText = '123';
      const { container } = renderWithTheme(<Amount>{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
    it('renders 1 digit fractional part', () => {
      const displayText = '123.4';
      const { container } = renderWithTheme(<Amount>{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
    it('renders 2 digit fractional part', () => {
      const displayText = '123.45';
      const { container } = renderWithTheme(<Amount>{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
    it('renders 3 digit fractional part', () => {
      const displayText = '123.456';
      const { container } = renderWithTheme(<Amount>{displayText}</Amount>);
      expect(container).toMatchSnapshot();
    });
  });

  describe('error', () => {
    it('throws error for a non numeric amount', () => {
      const displayText = 'abcd';
      const errorMessage = 'Expected children to be number \n(Eg. "1234", "12.34")';
      expect(() => renderWithTheme(<Amount>{displayText}</Amount>)).toThrow(errorMessage);
    });
  });
});
