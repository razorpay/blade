import React from 'react';
import { View } from 'react-native';
import { fireEvent } from '@testing-library/react-native';

import Button from '../index';
import { renderWithTheme } from '../../../_helpers/testing';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('Renders <Button /> correctly', () => {
  it('Throws error when <Button /> is not passed a string as children', () => {
    const errorMessage = 'Error in Button: expected `children` of type `string` but found object';
    expect(() =>
      renderWithTheme(
        <Button size="small">
          <View />
        </Button>,
      ),
    ).toThrow(errorMessage);
  });

  it('Renders Primary block <Button />', () => {
    const { container, getByText } = renderWithTheme(<Button block>Click Me</Button>);
    expect(getByText(/click me/i)).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('Renders xsmall Primary <Button />', () => {
    const { container, getByText } = renderWithTheme(<Button size="xsmall">Click Me</Button>);
    expect(getByText(/click me/i)).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('Renders a small Primary <Button />', () => {
    const { container, getByText } = renderWithTheme(<Button size="small">Click Me</Button>);
    expect(getByText(/click me/i)).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('Renders a small Primary <Button />', () => {
    const { container, getByText } = renderWithTheme(<Button size="small">Click Me</Button>);
    expect(getByText(/click me/i)).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('Renders a medium(Default) Primary <Button />', () => {
    const { container, getByText } = renderWithTheme(<Button icon="info">Click Me</Button>);
    expect(getByText(/click me/i)).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('Renders a large Primary <Button />', () => {
    const { container, getByText } = renderWithTheme(<Button size="large">Click Me</Button>);
    expect(getByText(/click me/i)).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('Renders a small Secondary <Button />', () => {
    const { container, getByText } = renderWithTheme(
      <Button variant="secondary" size="small">
        Click Me
      </Button>,
    );
    expect(getByText(/click me/i)).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('Renders a medium(Default) Secondary <Button />', () => {
    const { container, getByText } = renderWithTheme(<Button variant="secondary">Click Me</Button>);
    expect(getByText(/click me/i)).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('Renders a large Secondary <Button />', () => {
    const { container, getByText } = renderWithTheme(
      <Button variant="secondary" size="large">
        Click Me
      </Button>,
    );
    expect(getByText(/click me/i)).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('Renders a small Tertiary <Button />', () => {
    const { container, getByText } = renderWithTheme(
      <Button variant="tertiary" size="small">
        Click Me
      </Button>,
    );
    expect(getByText(/click me/i)).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('Renders a medium(Default) Tertiary <Button />', () => {
    const { container, getByText } = renderWithTheme(<Button variant="tertiary">Click Me</Button>);
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

  it('Renders a disabled Primary <Button />', () => {
    const { container, getByText } = renderWithTheme(<Button disabled>Click Me</Button>);
    expect(getByText(/click me/i)).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('Renders a disabled Secondary <Button />', () => {
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

describe('Renders an icon <Button /> correctly', () => {
  it('Renders a Primary <Button /> with left icon', () => {
    const { container, getByText } = renderWithTheme(<Button>Click Me</Button>);
    expect(getByText(/click me/i)).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('Renders a large Primary <Button /> with right icon', () => {
    const { container, getByText } = renderWithTheme(
      <Button size="large" icon="info" iconPosition="right">
        Click Me
      </Button>,
    );
    expect(getByText(/click me/i)).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('Renders an icon only <Button />', () => {
    const { container, getByText } = renderWithTheme(<Button>Click Me</Button>);
    expect(getByText(/click me/i)).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
});

describe('Checks onClick functionality of <Button />', () => {
  it('Checks onClick is called for <Button />', () => {
    const mockPress = jest.fn();
    const { getByText } = renderWithTheme(<Button onClick={mockPress}>Click Me</Button>);
    const button = getByText(/click me/i).parentNode;
    fireEvent.press(button);
    expect(mockPress).toBeCalledTimes(1);
  });

  it('Checks onClick is not called for disabled <Button />', () => {
    const mockPress = jest.fn();
    const { getByText } = renderWithTheme(
      <Button disabled onClick={mockPress}>
        Click Me
      </Button>,
    );
    const button = getByText(/click me/i).parentNode;
    fireEvent.press(button);
    expect(mockPress).not.toBeCalled();
  });
});
