import React from 'react';
import { fireEvent, act } from '@testing-library/react-native';
import Radio from './../RadioButton';
import { renderWithTheme } from '../../../_helpers/testing';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('Native <RadioButton />', () => {
  describe('Uncontrolled <Radio>', () => {
    test('should render uncontrolled Radio component', () => {
      const { container } = renderWithTheme(
        <Radio>
          <Radio.Option value="1" title="React" />
          <Radio.Option value="2" title="Angular" />
          <Radio.Option value="3" title="Vue" />
        </Radio>,
      );
      expect(container).toMatchSnapshot();
    });

    test('should render all the options passed as children to Radio context', () => {
      const { getByTestId } = renderWithTheme(
        <Radio>
          <Radio.Option value="1" title="React" testID="reactSelectId" />
          <Radio.Option value="2" title="Angular" testID="angularSelectId" />
          <Radio.Option value="3" title="Vue" testID="vueSelectId" />
        </Radio>,
      );
      const firstChildComponent = getByTestId('reactSelectId');
      const secondChildComponent = getByTestId('angularSelectId');
      const thirdChildComponent = getByTestId('vueSelectId');

      expect(firstChildComponent).toBeDefined();
      expect(secondChildComponent).toBeDefined();
      expect(thirdChildComponent).toBeDefined();
    });

    test('should match snapshot when clicked on first child', () => {
      const { getByTestId } = renderWithTheme(
        <Radio>
          <Radio.Option value="1" title="React" testID="reactSelectId" />
          <Radio.Option value="2" title="Angular" testID="angularSelectId" />
          <Radio.Option value="3" title="Vue" testID="vueSelectId" />
        </Radio>,
      );
      const firstChildComponent = getByTestId('reactSelectId');
      expect(firstChildComponent).toMatchSnapshot();

      act(() => {
        fireEvent.press(firstChildComponent);
      });
      expect(firstChildComponent).toMatchSnapshot();
    });

    test('snapshot testing when user presses in  on RadioButton', () => {
      const { container, getByTestId } = renderWithTheme(
        <Radio>
          <Radio.Option value="1" title="React" testID="reactSelectId" />
          <Radio.Option value="2" title="Angular" testID="angularSelectId" />
          <Radio.Option value="3" title="Vue" testID="vueSelectId" />
        </Radio>,
      );
      const component = getByTestId('reactSelectId');

      act(() => {
        fireEvent.pressIn(component);
      });

      expect(container).toMatchSnapshot();
    });

    test('snapshot testing when user presses in  on RadioButton of size large', () => {
      const { container, getByTestId } = renderWithTheme(
        <Radio>
          <Radio.Option value="1" title="React" size="large" testID="reactSelectId" />
          <Radio.Option value="2" title="Angular" size="large" testID="angularSelectId" />
          <Radio.Option value="3" title="Vue" size="large" testID="vueSelectId" />
        </Radio>,
      );
      const component = getByTestId('reactSelectId');

      act(() => {
        fireEvent.pressIn(component);
      });

      expect(container).toMatchSnapshot();
    });

    test('snapshot testing when user presses out', () => {
      const { container, getByTestId } = renderWithTheme(
        <Radio>
          <Radio.Option value="1" title="React" testID="reactSelectId" />
          <Radio.Option value="2" title="Angular" testID="angularSelectId" />
          <Radio.Option value="3" title="Vue" testID="vueSelectId" />
        </Radio>,
      );
      const component = getByTestId('angularSelectId');

      act(() => {
        fireEvent.pressIn(component);
        fireEvent.pressOut(component);
      });
      expect(container).toMatchSnapshot();
    });

    test('should render radio buttons of different sizes', () => {
      const { container } = renderWithTheme(
        <Radio>
          <Radio.Option value="1" title="React" size="large" />
          <Radio.Option value="2" title="Angular" size="medium" />
          <Radio.Option value="3" title="Vue" size="large" />
        </Radio>,
      );
      expect(container).toMatchSnapshot();
    });

    test('should render radio buttons with helpTexts', () => {
      const { container } = renderWithTheme(
        <Radio>
          <Radio.Option value="1" title="React" size="large" helpText="Click me!" />
          <Radio.Option value="2" title="Angular" size="medium" helpText="Click me!" />
          <Radio.Option value="3" title="Vue" size="small" />
        </Radio>,
      );
      expect(container).toMatchSnapshot();
    });

    test('should render radio buttons with disabled state', () => {
      const { container } = renderWithTheme(
        <Radio>
          <Radio.Option value="1" title="React" size="large" disabled helpText="Click me!" />
          <Radio.Option value="2" title="Angular" size="medium" disabled helpText="Click me!" />
          <Radio.Option value="3" title="Vue" size="small" disabled />
        </Radio>,
      );
      expect(container).toMatchSnapshot();
    });

    test('should not render helpText when the size is small', () => {
      const { queryByText } = renderWithTheme(
        <Radio>
          <Radio.Option value="1" title="React" size="small" disabled helpText="Fill details" />
        </Radio>,
      );
      const helpTextComponent = queryByText('Fill details');
      expect(helpTextComponent).toEqual(null);
    });

    test('should not render error when the size is small', () => {
      const { queryByText } = renderWithTheme(
        <Radio>
          <Radio.Option
            value="1"
            title="React"
            size="small"
            disabled
            errorText="Something is wrong!"
          />
        </Radio>,
      );
      const errorTextComponent = queryByText('Something is wrong!');
      expect(errorTextComponent).toEqual(null);
    });
  });

  describe('controlled component', () => {
    test('should render uncontrolled Radio component', () => {
      const { container } = renderWithTheme(
        <Radio value="1" onValueChange={jest.fn()}>
          <Radio.Option value="1" title="React" />
          <Radio.Option value="2" title="Angular" />
          <Radio.Option value="3" title="Vue" />
        </Radio>,
      );
      expect(container).toMatchSnapshot();
    });

    test('should match snapshot testing when user presses in  on RadioButton of medium large', () => {
      const { container, getByTestId } = renderWithTheme(
        <Radio value="2" onValueChange={jest.fn()}>
          <Radio.Option value="1" title="React" size="large" testID="reactSelectId" />
          <Radio.Option value="2" title="Angular" size="medium" testID="angularSelectId" />
          <Radio.Option value="3" title="Vue" size="large" testID="vueSelectId" />
        </Radio>,
      );
      const component = getByTestId('reactSelectId');

      act(() => {
        fireEvent.pressIn(component);
      });

      expect(container).toMatchSnapshot();
    });
  });
});
