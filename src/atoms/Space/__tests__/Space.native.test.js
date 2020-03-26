import React from 'react';
import { render } from '@testing-library/react-native';
import View from '../../View';
import Space from '../index';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('Renders <Space /> correctly', () => {
  it('should apply padding to child component', () => {
    const { container } = render(
      <Space padding={[1, 2]}>
        <View />
      </Space>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render child component with no spacings applied', () => {
    const { container, getByTestId } = render(
      <Space>
        <View testID="space-view" />
      </Space>,
    );
    const childView = getByTestId('space-view');
    expect(childView.props.style).toMatchObject([{}]);
    expect(container).toMatchSnapshot();
  });

  it('should apply margin to child component', () => {
    const { container } = render(
      <Space margin={[5, 5]}>
        <View />
      </Space>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should throw error when more than one nodes are passed as children', () => {
    const expectedErrorMessage = 'Expected a single child for Space component';
    expect(() =>
      render(
        <Space margin={[5, 5]}>
          <View />
          <View />
        </Space>,
      ),
    ).toThrow(expectedErrorMessage);
  });
});
