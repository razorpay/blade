import React from 'react';
import Heading from '../index';
import { renderWithTheme } from '../../../_helpers/testing';

describe('<Heading />', () => {
  it('should render a heading with default props', () => {
    const displayText = 'Heading';
    const { container } = renderWithTheme(<Heading size="medium">{displayText}</Heading>);
    expect(container).toMatchSnapshot();
  });
  describe('size', () => {
    it('should render a heading with size medium', () => {
      const displayText = 'Heading';
      const { container } = renderWithTheme(<Heading size="medium">{displayText}</Heading>);
      expect(container).toMatchSnapshot();
    });
    it('should render a heading with size large', () => {
      const displayText = 'Heading';
      const { container } = renderWithTheme(<Heading size="large">{displayText}</Heading>);
      expect(container).toMatchSnapshot();
    });
    it('should render a heading with size xlarge', () => {
      const displayText = 'Heading';
      const { container } = renderWithTheme(<Heading size="xlarge">{displayText}</Heading>);
      expect(container).toMatchSnapshot();
    });
    it('should render a heading with size xxlarge', () => {
      const displayText = 'Heading';
      const { container } = renderWithTheme(<Heading size="xxlarge">{displayText}</Heading>);
      expect(container).toMatchSnapshot();
    });
    it('should render a heading with size xxxlarge', () => {
      const displayText = 'Heading';
      const { container } = renderWithTheme(<Heading size="xxxlarge">{displayText}</Heading>);
      expect(container).toMatchSnapshot();
    });
  });

  describe('color', () => {
    it('should render a heading with custom color', () => {
      const displayText = 'Heading';
      const { container } = renderWithTheme(
        <Heading size="medium" color="primary.900">
          {displayText}
        </Heading>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('weight', () => {
    it('should render a heading with regular weight', () => {
      const displayText = 'Heading';
      const { container } = renderWithTheme(
        <Heading size="medium" weight="regular">
          {displayText}
        </Heading>,
      );
      expect(container).toMatchSnapshot();
    });
    it('should render a heading with bold weight', () => {
      const displayText = 'Heading';
      const { container } = renderWithTheme(
        <Heading size="medium" weight="bold">
          {displayText}
        </Heading>,
      );
      expect(container).toMatchSnapshot();
    });
  });
});
