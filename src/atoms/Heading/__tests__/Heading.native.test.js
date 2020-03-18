import React from 'react';
import Heading from '../index';
import { renderWithTheme } from '../../../_helpers/testing';

describe('<Heading />', () => {
  describe('size', () => {
    it('renders heading with size medium', () => {
      const displayText = 'Heading';
      const { container } = renderWithTheme(<Heading size="H1">{displayText}</Heading>);
      expect(container).toMatchSnapshot();
    });
    it('renders heading with size large', () => {
      const displayText = 'Heading';
      const { container } = renderWithTheme(<Heading size="large">{displayText}</Heading>);
      expect(container).toMatchSnapshot();
    });
    it('renders heading with size xlarge', () => {
      const displayText = 'Heading';
      const { container } = renderWithTheme(<Heading size="xlarge">{displayText}</Heading>);
      expect(container).toMatchSnapshot();
    });
    it('renders heading with size xxlarge', () => {
      const displayText = 'Heading';
      const { container } = renderWithTheme(<Heading size="xxlarge">{displayText}</Heading>);
      expect(container).toMatchSnapshot();
    });
    it('renders heading with size xxxlarge', () => {
      const displayText = 'Heading';
      const { container } = renderWithTheme(<Heading size="xxxlarge">{displayText}</Heading>);
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

  describe('weight', () => {
    it('renders heading with regular weight', () => {
      const displayText = 'Heading';
      const { container } = renderWithTheme(<Heading weight="regular">{displayText}</Heading>);
      expect(container).toMatchSnapshot();
    });
    it('renders heading with bold weight', () => {
      const displayText = 'Heading';
      const { container } = renderWithTheme(<Heading weight="bold">{displayText}</Heading>);
      expect(container).toMatchSnapshot();
    });
  });
});
