import React from 'react';
import { renderWithTheme } from '../../../_helpers/testing';
import { fireEvent, act } from '@testing-library/react-native';
import Tab from '../Tab';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Tab />', () => {
  describe('unselected tab', () => {
    test('should render tab when is not active', () => {
      const { container, getAllByText } = renderWithTheme(
        <Tab label="Active state" active={false} />,
      );
      expect(container).toMatchSnapshot();
      const label = getAllByText('Active state');
      expect(label).toBeTruthy();
    });

    test('should match snapshot when valid icon name is passed', () => {
      const { container } = renderWithTheme(
        <Tab label="Active state" icon="info" active={false} />,
      );
      expect(container).toMatchSnapshot();
    });

    test('should match snapshot when disabled, with icon present', () => {
      const { container } = renderWithTheme(
        <Tab label="Active state" icon="info" disabled={true} active={false} />,
      );
      expect(container).toMatchSnapshot();
    });

    test('should call onPress method when press event is fired on tab', () => {
      const onPressMockCallback = jest.fn();
      const { container, getByTestId } = renderWithTheme(
        <Tab
          active={false}
          label="Active state"
          icon="info"
          onPress={onPressMockCallback}
          testID="test-active-tab"
        />,
      );
      expect(container).toMatchSnapshot();
      const component = getByTestId('test-active-tab');
      act(() => {
        fireEvent.press(component);
      });
      expect(onPressMockCallback).toHaveBeenCalled();
    });

    test('should match snapshot for user taps on tab button', () => {
      const onPressMockCallback = jest.fn();
      const { container, getByTestId } = renderWithTheme(
        <Tab
          active={false}
          label="Active state"
          icon="info"
          onPress={onPressMockCallback}
          testID="test-active-tab-press-in"
        />,
      );
      expect(container).toMatchSnapshot();
      const component = getByTestId('test-active-tab-press-in');
      act(() => {
        fireEvent.pressIn(component);
      });
      expect(container).toMatchSnapshot();
    });

    test('should match snapshot for user taps on tab button', () => {
      const onPressMockCallback = jest.fn();
      const { container, getByTestId } = renderWithTheme(
        <Tab
          active={false}
          label="Active state"
          icon="info"
          onPress={onPressMockCallback}
          testID="test-active-tab-press-in"
        />,
      );
      expect(container).toMatchSnapshot();
      const component = getByTestId('test-active-tab-press-in');
      act(() => {
        fireEvent.pressIn(component);
        expect(container).toMatchSnapshot();
        fireEvent.pressOut(component);
      });
      expect(container).toMatchSnapshot();
    });
  });

  describe('selected selected tab', () => {
    test('should render tab when active', () => {
      const { container, getAllByText } = renderWithTheme(
        <Tab label="Active state" active={true} />,
      );
      expect(container).toMatchSnapshot();
      const label = getAllByText('Active state');
      expect(label).toBeTruthy();
    });

    test('should match snapshot when valid icon name is passed', () => {
      const { container } = renderWithTheme(<Tab label="Active state" icon="info" active={true} />);
      expect(container).toMatchSnapshot();
    });

    test('should match snapshot when disabled, with icon present', () => {
      const { container } = renderWithTheme(
        <Tab label="Active state" icon="info" disabled={true} active={true} />,
      );
      expect(container).toMatchSnapshot();
    });

    test('should throw error when invalid icon name is passed', () => {
      expect(() =>
        renderWithTheme(
          <Tab label="Active state" icon="invalidIcon" disabled={true} active={true} />,
        ),
      ).toThrowError();
    });

    test('should call onPress method when press event is fired on tab', () => {
      const onPressMockCallback = jest.fn();
      const { container, getByTestId } = renderWithTheme(
        <Tab
          active={true}
          label="Active state"
          icon="info"
          onPress={onPressMockCallback}
          testID="test-active-tab"
        />,
      );
      expect(container).toMatchSnapshot();
      const component = getByTestId('test-active-tab');
      act(() => {
        fireEvent.press(component);
      });
      expect(onPressMockCallback).toHaveBeenCalled();
    });

    test('should match snapshot for user taps on tab button', () => {
      const onPressMockCallback = jest.fn();
      const { container, getByTestId } = renderWithTheme(
        <Tab
          active={true}
          label="Active state"
          icon="info"
          onPress={onPressMockCallback}
          testID="test-active-tab-press-in"
        />,
      );
      expect(container).toMatchSnapshot();
      const component = getByTestId('test-active-tab-press-in');
      act(() => {
        fireEvent.pressIn(component);
      });
      expect(container).toMatchSnapshot();
    });

    test('should match snapshot for user taps on tab button', () => {
      const onPressMockCallback = jest.fn();
      const { container, getByTestId } = renderWithTheme(
        <Tab
          active={true}
          label="Active state"
          icon="info"
          onPress={onPressMockCallback}
          testID="test-active-tab-press-in"
        />,
      );
      expect(container).toMatchSnapshot();
      const component = getByTestId('test-active-tab-press-in');
      act(() => {
        fireEvent.pressIn(component);
        expect(container).toMatchSnapshot();
        fireEvent.pressOut(component);
      });
      expect(container).toMatchSnapshot();
    });
  });
});
