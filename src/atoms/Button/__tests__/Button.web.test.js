import React from 'react';
import { fireEvent } from '@testing-library/react';

import Button from '../index';
import View from '../../View';
import { renderWithTheme } from '../../../_helpers/testing';

describe('<Button />', () => {
  describe('block', () => {
    it('renders block primary <Button />', () => {
      const { container, getByText } = renderWithTheme(<Button block>Click Me</Button>);
      expect(getByText(/click me/i)).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
  });
  describe('size', () => {
    it('renders xsmall primary <Button />', () => {
      const { container, getByText } = renderWithTheme(<Button size="xsmall">Click Me</Button>);
      expect(getByText(/click me/i)).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
    it('renders a small Primary <Button />', () => {
      const { container, getByText } = renderWithTheme(<Button size="small">Click Me</Button>);
      expect(getByText(/click me/i)).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
    it('renders a small Primary <Button />', () => {
      const { container, getByText } = renderWithTheme(<Button size="small">Click Me</Button>);
      expect(getByText(/click me/i)).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
    it('renders a large Primary <Button />', () => {
      const { container, getByText } = renderWithTheme(<Button size="large">Click Me</Button>);
      expect(getByText(/click me/i)).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
  });
  describe('variant', () => {
    it('renders a small Primary <Button />', () => {
      const { container, getByText } = renderWithTheme(
        <Button variant="primary" size="small">
          Click Me
        </Button>,
      );
      expect(getByText(/click me/i)).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
    it('renders a medium(Default) Secondary <Button />', () => {
      const { container, getByText } = renderWithTheme(
        <Button variant="secondary">Click Me</Button>,
      );
      expect(getByText(/click me/i)).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
    it('renders a small Tertiary <Button />', () => {
      const { container, getByText } = renderWithTheme(
        <Button variant="tertiary" size="small">
          Click Me
        </Button>,
      );
      expect(getByText(/click me/i)).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
    it('renders a large Secondary <Button />', () => {
      const { container, getByText } = renderWithTheme(
        <Button variant="secondary" size="large">
          Click Me
        </Button>,
      );
      expect(getByText(/click me/i)).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
    it('renders a medium(Default) Tertiary <Button />', () => {
      const { container, getByText } = renderWithTheme(
        <Button variant="tertiary">Click Me</Button>,
      );
      expect(getByText(/click me/i)).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
    it('Renders a large Tertiary <Button />', () => {
      const { container, getByText } = renderWithTheme(
        <Button variant="tertiary" size="large">
          Click Me
        </Button>,
      );
      expect(getByText(/click me/i)).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
  });
  describe('disabled', () => {
    it('Renders a disabled Primary <Button />', () => {
      const { container, getByText } = renderWithTheme(<Button disabled>Click Me</Button>);
      expect(getByText(/click me/i)).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
    it('renders a disabled Secondary <Button />', () => {
      const { container, getByText } = renderWithTheme(
        <Button disabled variant="secondary">
          Click Me
        </Button>,
      );
      expect(getByText(/click me/i)).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
    it('Renders a disabled Tertiary <Button />', () => {
      const { container, getByText } = renderWithTheme(
        <Button disabled variant="tertiary">
          Click Me
        </Button>,
      );
      expect(getByText(/click me/i)).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
  });
  describe('checks onClick functionality of <Button />', () => {
    it('checks onClick is called for <Button />', () => {
      const mockPress = jest.fn();
      const { getByText } = renderWithTheme(<Button onClick={mockPress}>Click Me</Button>);
      const button = getByText(/click me/i).parentNode;
      fireEvent.click(button);
      expect(mockPress).toBeCalledTimes(1);
    });
    it('checks onClick is not called for disabled <Button />', () => {
      const mockPress = jest.fn();
      const { getByText } = renderWithTheme(
        <Button disabled onClick={mockPress}>
          Click Me
        </Button>,
      );
      const button = getByText(/click me/i).parentNode;
      fireEvent.click(button);
      expect(mockPress).not.toBeCalled();
    });
  });
  describe('error', () => {
    beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
    afterAll(() => jest.restoreAllMocks());
    it('throws error when <Button /> is not passed a string as children', () => {
      const errorMessage = 'Error in Button: expected `children` of type `string` but found object';
      expect(() =>
        renderWithTheme(
          <Button size="small">
            <View />
          </Button>,
        ),
      ).toThrow(errorMessage);
    });
  });
  describe('icon', () => {
    it('renders <Button /> with Info icon ', () => {
      const { container, getByText } = renderWithTheme(<Button icon="info">Click Me</Button>);
      expect(getByText(/click me/i)).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
    it('renders a large Primary <Button /> with right icon', () => {
      const { container, getByText } = renderWithTheme(
        <Button size="large" icon="info" iconAlign="right">
          Click Me
        </Button>,
      );
      expect(getByText(/click me/i)).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
    it('renders a large Primary <Button /> with left icon', () => {
      const { container, getByText } = renderWithTheme(
        <Button size="large" icon="info" iconAlign="left">
          Click Me
        </Button>,
      );
      expect(getByText(/click me/i)).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
  });
});
