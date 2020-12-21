import React from 'react';
import { fireEvent, act } from '@testing-library/react-native';
import { renderWithTheme } from '../../../_helpers/testing';
import Tabs from '../Tabs';
import Text from '../../../atoms/Text';
import View from '../../../atoms/View';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Tabs />', () => {
  describe('renders', () => {
    it('three tabs without defaultValue', () => {
      const { container } = renderWithTheme(
        <Tabs>
          <Tabs.Tab value="one" title="One" testID="ds-tab-one">
            <Text>Screen One</Text>
          </Tabs.Tab>
          <Tabs.Tab value="two" title="Two" testID="ds-tab-two">
            <Text>Screen Two</Text>
          </Tabs.Tab>
          <Tabs.Tab value="three" title="Three" testID="ds-tab-three">
            <Text>Screen Three</Text>
          </Tabs.Tab>
        </Tabs>,
      );
      expect(container).toMatchSnapshot();
    });

    it('three tabs with defaultValue', () => {
      const { container } = renderWithTheme(
        <Tabs defaultValue="one">
          <Tabs.Tab value="one" title="One" testID="ds-tab-one">
            <Text>Screen One</Text>
          </Tabs.Tab>
          <Tabs.Tab value="two" title="Two" testID="ds-tab-two">
            <Text>Screen Two</Text>
          </Tabs.Tab>
          <Tabs.Tab value="three" title="Three" testID="ds-tab-three">
            <Text>Screen Three</Text>
          </Tabs.Tab>
        </Tabs>,
      );
      expect(container).toMatchSnapshot();
    });

    it('two tabs with icons', () => {
      const { container } = renderWithTheme(
        <Tabs defaultValue="one">
          <Tabs.Tab value="one" title="One" icon="info">
            <Text>Screen One</Text>
          </Tabs.Tab>
          <Tabs.Tab value="two" title="Two" icon="info">
            <Text>Screen Two</Text>
          </Tabs.Tab>
        </Tabs>,
      );
      expect(container).toMatchSnapshot();
    });

    it('two tabs with one disabled', () => {
      const { container } = renderWithTheme(
        <Tabs defaultValue="one">
          <Tabs.Tab value="one" title="One" icon="info">
            <Text>Screen One</Text>
          </Tabs.Tab>
          <Tabs.Tab value="two" title="Two" icon="info" disabled>
            <Text>Screen Two</Text>
          </Tabs.Tab>
        </Tabs>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('onChange', () => {
    it('changes tab', () => {
      const onChangeMockFunction = jest.fn();

      const { container, getByTestId } = renderWithTheme(
        <Tabs defaultValue="one" onChange={onChangeMockFunction}>
          <Tabs.Tab value="one" title="One" testID="ds-tab-one">
            <Text>Screen One</Text>
          </Tabs.Tab>
          <Tabs.Tab value="two" title="Two" testID="ds-tab-two">
            <Text>Screen Two</Text>
          </Tabs.Tab>
        </Tabs>,
      );
      expect(container).toMatchSnapshot();
      const component = getByTestId('ds-tab-two');
      act(() => {
        fireEvent.press(component);
      });
      expect(container).toMatchSnapshot();
      expect(onChangeMockFunction).toHaveBeenCalledWith('two');
    });
  });

  describe('controlled', () => {
    it('does not change tab', () => {
      const { container, getByTestId } = renderWithTheme(
        <Tabs value="one">
          <Tabs.Tab value="one" title="One" testID="ds-tab-one">
            <Text>Screen One</Text>
          </Tabs.Tab>
          <Tabs.Tab value="two" title="Two" testID="ds-tab-two">
            <Text>Screen Two</Text>
          </Tabs.Tab>
        </Tabs>,
      );
      expect(container).toMatchSnapshot();
      const component = getByTestId('ds-tab-two');
      act(() => {
        fireEvent.press(component);
      });
      expect(container).toMatchSnapshot();
    });
  });

  describe('renders only Tabs.Tab', () => {
    it('discards other children', () => {
      const { container } = renderWithTheme(
        <Tabs value="one">
          <View>
            <Text>Hello World</Text>
          </View>
          <Tabs.Tab value="one" title="One" testID="ds-tab-one">
            <Text>Screen One</Text>
          </Tabs.Tab>
          <Tabs.Tab value="two" title="Two" testID="ds-tab-two">
            <Text>Screen Two</Text>
          </Tabs.Tab>
        </Tabs>,
      );
      expect(container).toMatchSnapshot();
    });
  });
});
