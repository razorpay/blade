import React from 'react';
import Heading from '../index';
import { renderWithTheme } from '../../../_helpers/testing';

describe('<Heading />', () => {
  describe('size', () => {
    it('renders heading with size H1', () => {
      const displayText = 'Heading';
      const { container } = renderWithTheme(<Heading size="H1">{displayText}</Heading>);
      expect(container).toMatchSnapshot();
    });
    it('renders heading with size H2', () => {
      const displayText = 'Heading';
      const { container } = renderWithTheme(<Heading size="H2">{displayText}</Heading>);
      expect(container).toMatchSnapshot();
    });
    it('renders heading with size H3', () => {
      const displayText = 'Heading';
      const { container } = renderWithTheme(<Heading size="H3">{displayText}</Heading>);
      expect(container).toMatchSnapshot();
    });
    it('renders heading with size H4', () => {
      const displayText = 'Heading';
      const { container } = renderWithTheme(<Heading size="H4">{displayText}</Heading>);
      expect(container).toMatchSnapshot();
    });
    it('renders heading with size H5', () => {
      const displayText = 'Heading';
      const { container } = renderWithTheme(<Heading size="H5">{displayText}</Heading>);
      expect(container).toMatchSnapshot();
    });
    it('renders heading with size H6', () => {
      const displayText = 'Heading';
      const { container } = renderWithTheme(<Heading size="H6">{displayText}</Heading>);
      expect(container).toMatchSnapshot();
    });
    it('renders heading with size H7', () => {
      const displayText = 'Heading';
      const { container } = renderWithTheme(<Heading size="H7">{displayText}</Heading>);
      expect(container).toMatchSnapshot();
    });
  });

  describe('color', () => {
    it('renders heading with custom color', () => {
      const displayText = 'Heading';
      const { container } = renderWithTheme(<Heading color="primary.900">{displayText}</Heading>);
      expect(container).toMatchSnapshot();
    });
  });

  describe('align', () => {
    it('renders heading with left align', () => {
      const displayText = 'Heading';
      const { container } = renderWithTheme(<Heading align="left">{displayText}</Heading>);
      expect(container).toMatchSnapshot();
    });
    it('renders heading with center align', () => {
      const displayText = 'Heading';
      const { container } = renderWithTheme(<Heading align="center">{displayText}</Heading>);
      expect(container).toMatchSnapshot();
    });
    it('renders heading with right align', () => {
      const displayText = 'Heading';
      const { container } = renderWithTheme(<Heading align="right">{displayText}</Heading>);
      expect(container).toMatchSnapshot();
    });
  });
});
