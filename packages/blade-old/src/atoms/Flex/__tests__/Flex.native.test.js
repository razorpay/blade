import React from 'react';
import { render } from '@testing-library/react-native';

import View from '../../View';
import Flex from '../index';
import Space from '../../Space';
import Size from '../../Size';

const defaultFlexStyles = {
  flexDirection: 'column',
};
const defaultSpaceStyles = {};
const defaultSizeStyles = {};

describe('Renders <Flex /> correctly', () => {
  it('renders child of <Flex />(no styles) correctly', () => {
    const { container, getByTestId } = render(
      <Flex>
        <View testID="flex-view" />
      </Flex>,
    );
    const childView = getByTestId('flex-view');
    expect(childView.props.style).toMatchObject([[defaultFlexStyles]]);
    expect(container).toMatchSnapshot();
  });
});

describe('<Flex /> and <Space /> together plays properly', () => {
  it('renders child of <Flex />(no styles) and <Space />(no styles) correctly', () => {
    const { container, getByTestId } = render(
      <Flex>
        <Space>
          <View testID="flex-space-view" />
        </Space>
      </Flex>,
    );
    const childView = getByTestId('flex-space-view');
    expect(childView.props.style).toMatchObject([[defaultSpaceStyles, [defaultFlexStyles]]]);
    expect(container).toMatchSnapshot();
  });

  it('renders child of <Space />(no styles) and <Flex />(no styles) correctly', () => {
    const { container, getByTestId } = render(
      <Space>
        <Flex>
          <View testID="space-flex-view" />
        </Flex>
      </Space>,
    );
    const childView = getByTestId('space-flex-view');
    expect(childView.props.style).toMatchObject([[defaultFlexStyles, [defaultSpaceStyles]]]);
    expect(container).toMatchSnapshot();
  });
});

describe('<Flex /> and <Size /> together plays properly', () => {
  it('renders child of <Flex />(no styles) and <Size />(no styles) correctly', () => {
    const { container, getByTestId } = render(
      <Flex>
        <Size>
          <View testID="flex-size-view" />
        </Size>
      </Flex>,
    );
    const childView = getByTestId('flex-size-view');
    expect(childView.props.style).toMatchObject([[defaultSpaceStyles, [defaultFlexStyles]]]);
    expect(container).toMatchSnapshot();
  });

  it('renders child of <Size />(no styles) and <Flex />(no styles) correctly', () => {
    const { container, getByTestId } = render(
      <Size>
        <Flex>
          <View testID="size-flex-view" />
        </Flex>
      </Size>,
    );
    const childView = getByTestId('size-flex-view');
    expect(childView.props.style).toMatchObject([[defaultFlexStyles, [defaultSpaceStyles]]]);
    expect(container).toMatchSnapshot();
  });
});

describe('<Flex />, <Size />, <Space /> together plays properly', () => {
  it('renders child of <Flex />(no styles) and <Space />(no styles) and <Size />(no styles) correctly', () => {
    const { container, getByTestId } = render(
      <Flex>
        <Space>
          <Size>
            <View testID="flex-space-size-view" />
          </Size>
        </Space>
      </Flex>,
    );
    const childView = getByTestId('flex-space-size-view');
    expect(childView.props.style).toMatchObject([
      [defaultSizeStyles, [defaultSpaceStyles, [defaultFlexStyles]]],
    ]);
    expect(container).toMatchSnapshot();
  });

  it('renders an inline styled child of <Flex />(no styles) and <Space />(no styles) and <Size />(no styles) correctly', () => {
    const viewStyles = {
      backgroundColor: 'red',
      height: 100,
    };
    const { container, getByTestId } = render(
      <Flex>
        <Space>
          <Size>
            <View style={viewStyles} testID="flex-space-size-inlineStyledView" />
          </Size>
        </Space>
      </Flex>,
    );
    const childView = getByTestId('flex-space-size-inlineStyledView');
    expect(childView.props.style).toMatchObject([
      [defaultSizeStyles, [defaultSpaceStyles, [defaultFlexStyles]]],
      viewStyles,
    ]);
    expect(container).toMatchSnapshot();
  });
  it('renders an inline styled child of <Flex />(with styles) and <Space />(with styles) and <Size />(with styles) correctly', () => {
    const flexStyles = {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
      flexDirection: 'row',
    };
    const spaceStyles = {
      marginTop: 1,
      marginRight: 1,
      marginBottom: 1,
      marginLeft: 1,
    };
    const sizeStyles = {
      height: 50,
      width: 50,
    };
    const viewStyles = {
      backgroundColor: 'red',
      height: 100,
    };
    const { container, getByTestId } = render(
      <Flex flex={1} flexDirection="row">
        <Space margin={['1px']}>
          <Size height="50px" width="50px">
            <View style={viewStyles} testID="styled-flex-space-size-view" />
          </Size>
        </Space>
      </Flex>,
    );
    const childView = getByTestId('styled-flex-space-size-view');
    expect(childView.props.style).toMatchObject([
      [sizeStyles, [spaceStyles, [flexStyles]]],
      viewStyles,
    ]);
    expect(container).toMatchSnapshot();
  });
});
