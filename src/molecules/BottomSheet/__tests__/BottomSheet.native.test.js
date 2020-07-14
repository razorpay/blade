import React from 'react';
import { act } from '@testing-library/react-native';
import BottomSheet from '../BottomSheet';
import { renderWithTheme } from '../../../_helpers/testing';
import View from '../../../atoms/View';
import Text from '../../../atoms/Text';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<BottomSheet />', () => {
  it('renders default BottomSheet', () => {
    const bottomSheetRef = React.createRef();
    const { container } = renderWithTheme(<BottomSheet ref={bottomSheetRef} />);
    act(() => {
      bottomSheetRef.current.open();
    });
    expect(container).toMatchSnapshot();
  });

  it('renders BottomSheet with Header, Footer and Content Defined', () => {
    const bottomSheetRef = React.createRef();
    const { container } = renderWithTheme(
      <BottomSheet
        ref={bottomSheetRef}
        FooterComponent={
          <View>
            <Text>Footer</Text>
          </View>
        }
      >
        <BottomSheet.Header>
          <View>
            <Text>Header</Text>
          </View>
        </BottomSheet.Header>
        <BottomSheet.Content>
          <View>
            <Text>Bottomsheet content</Text>
          </View>
        </BottomSheet.Content>
        <BottomSheet.Footer>
          <View>
            <Text>Footer</Text>
          </View>
        </BottomSheet.Footer>
      </BottomSheet>,
    );
    act(() => {
      bottomSheetRef.current.open();
    });
    expect(container).toMatchSnapshot();
  });

  it('should throw error when multiple Headers are passed to bottomsheet', () => {
    const bottomSheetRef = React.createRef();

    expect(() =>
      renderWithTheme(
        <BottomSheet
          ref={bottomSheetRef}
          FooterComponent={
            <View>
              <Text>Footer</Text>
            </View>
          }
        >
          <BottomSheet.Header>
            <View>
              <Text>Header1</Text>
            </View>
          </BottomSheet.Header>
          <BottomSheet.Header>
            <View>
              <Text>Header2</Text>
            </View>
          </BottomSheet.Header>
          <BottomSheet.Content>
            <View>
              <Text>Bottomsheet content</Text>
            </View>
          </BottomSheet.Content>
          <BottomSheet.Footer>
            <View>
              <Text>Footer</Text>
            </View>
          </BottomSheet.Footer>
        </BottomSheet>,
      ),
    ).toThrow('expected to have single `BottomSheet.Header` but found 2');
  });

  it('should throw error when multiple Footer are passed to bottomsheet', () => {
    const bottomSheetRef = React.createRef();

    expect(() =>
      renderWithTheme(
        <BottomSheet
          ref={bottomSheetRef}
          FooterComponent={
            <View>
              <Text>Footer</Text>
            </View>
          }
        >
          <BottomSheet.Header>
            <View>
              <Text>Header1</Text>
            </View>
          </BottomSheet.Header>
          <BottomSheet.Content>
            <View>
              <Text>Bottomsheet content</Text>
            </View>
          </BottomSheet.Content>
          <BottomSheet.Footer>
            <View>
              <Text>Footer1</Text>
            </View>
          </BottomSheet.Footer>
          <BottomSheet.Footer>
            <View>
              <Text>Footer2</Text>
            </View>
          </BottomSheet.Footer>
        </BottomSheet>,
      ),
    ).toThrow('expected to have single `BottomSheet.Footer` but found 2');
  });
});
