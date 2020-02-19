import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import Button from '../index';
import { renderWithTheme } from '../../../_helpers/testing';

describe('Renders <Button /> correctly', () => {
  it('Renders a Primary <Button />', () => {
    const { container } = renderWithTheme(<Button icon="info">Click Me</Button>);
    expect(container).toMatchSnapshot();
  });

  it('Renders a Primary <Button /> with left icon', () => {
    const { container } = renderWithTheme(<Button>Click Me</Button>);
    expect(container).toMatchSnapshot();
  });

  it('Renders a small Primary <Button />', () => {
    const { container } = renderWithTheme(<Button size="small">Click Me</Button>);
    expect(container).toMatchSnapshot();
  });

  it('Renders a large Primary <Button />', () => {
    const { container } = renderWithTheme(<Button size="large">Click Me</Button>);
    expect(container).toMatchSnapshot();
  });

  it('Renders a large Primary <Button /> with right icon', () => {
    const { container } = renderWithTheme(
      <Button size="large" icon="info" iconPosition="right">
        Click Me
      </Button>,
    );
    expect(container).toMatchSnapshot();
  });

  it('Renders a disabled Primary <Button />', () => {
    const { container } = renderWithTheme(<Button disabled>Click Me</Button>);
    expect(container).toMatchSnapshot();
  });

  it('Renders a Secondary <Button />', () => {
    const { container } = renderWithTheme(<Button type="secondary">Click Me</Button>);
    expect(container).toMatchSnapshot();
  });

  it('Renders a small Secondary <Button />', () => {
    const { container } = renderWithTheme(
      <Button type="secondary" size="small">
        Click Me
      </Button>,
    );
    expect(container).toMatchSnapshot();
  });

  it('Renders a large Secondary <Button />', () => {
    const { container } = renderWithTheme(
      <Button type="secondary" size="large">
        Click Me
      </Button>,
    );
    expect(container).toMatchSnapshot();
  });

  it('Renders a disabled Secondary <Button />', () => {
    const { container } = renderWithTheme(
      <Button disabled type="secondary">
        Click Me
      </Button>,
    );
    expect(container).toMatchSnapshot();
  });

  it('Renders a Tertiary <Button />', () => {
    const { container } = renderWithTheme(<Button type="tertiary">Click Me</Button>);
    expect(container).toMatchSnapshot();
  });

  it('Renders a small Tertiary <Button />', () => {
    const { container } = renderWithTheme(
      <Button type="tertiary" size="small">
        Click Me
      </Button>,
    );
    expect(container).toMatchSnapshot();
  });

  it('Renders a large Tertiary <Button /> correctly', () => {
    const { container } = renderWithTheme(
      <Button type="tertiary" size="large">
        Click Me
      </Button>,
    );
    expect(container).toMatchSnapshot();
  });

  it('Renders a disabled Tertiary <Button />', () => {
    const { container } = renderWithTheme(
      <Button disabled type="tertiary">
        Click Me
      </Button>,
    );
    expect(container).toMatchSnapshot();
  });

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
