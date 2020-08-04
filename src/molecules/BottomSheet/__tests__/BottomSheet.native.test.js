import React from 'react';
import BottomSheet from '../BottomSheet';
import { renderWithTheme } from '../../../_helpers/testing';
import View from '../../../atoms/View';
import Text from '../../../atoms/Text';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<BottomSheet />', () => {
  let mockOnClose;
  beforeEach(() => {
    mockOnClose = jest.fn();
  });
  it('renders default BottomSheet', () => {
    const { container } = renderWithTheme(<BottomSheet visible={true} onClose={mockOnClose} />);
    expect(container).toMatchSnapshot();
  });

  it('renders BottomSheet with Header, Footer and Content Defined', () => {
    const { container } = renderWithTheme(
      <BottomSheet
        visible={true}
        FooterComponent={
          <View>
            <Text>Footer</Text>
          </View>
        }
        onClose={mockOnClose}
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
    expect(container).toMatchSnapshot();
  });

  it('renders bottomsheet when initialHeight prop is passed', () => {
    const { container } = renderWithTheme(
      <BottomSheet
        visible={true}
        initialHeight={300}
        FooterComponent={
          <View>
            <Text>Footer</Text>
          </View>
        }
        onClose={() => {}}
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

    expect(container).toMatchSnapshot();
  });

  it('renders linear-gradient view at bottom when content height is more than open bottomsheet height', () => {
    const list = [
      'Samsung',
      'Xiaomi',
      'OnePlus',
      'Apple',
      'Vivo',
      'Oppo',
      'Lenovo',
      'LG',
      'Nokia',
      'HTC',
    ];

    const data = new Array(list.length).fill({}).map((item, index) => ({
      id: index,
      name: list[index],
    }));

    const { container } = renderWithTheme(
      <BottomSheet
        visible={true}
        FooterComponent={
          <View>
            <Text>Footer</Text>
          </View>
        }
        onClose={mockOnClose}
      >
        <BottomSheet.Header>
          <View>
            <Text>Header</Text>
          </View>
        </BottomSheet.Header>
        <BottomSheet.Content>
          {data.map((item) => (
            <View key={item.id}>
              <Text>{item.name}</Text>
            </View>
          ))}
        </BottomSheet.Content>
        <BottomSheet.Footer>
          <View>
            <Text>Footer</Text>
          </View>
        </BottomSheet.Footer>
      </BottomSheet>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should throw error when multiple Headers are passed to bottomsheet', () => {
    expect(() =>
      renderWithTheme(
        <BottomSheet
          visible={true}
          FooterComponent={
            <View>
              <Text>Footer</Text>
            </View>
          }
          onClose={mockOnClose}
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
    expect(() =>
      renderWithTheme(
        <BottomSheet
          visible={true}
          FooterComponent={
            <View>
              <Text>Footer</Text>
            </View>
          }
          onClose={mockOnClose}
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

  it('should throw error when onClose method callback is not passed', () => {
    expect(() =>
      renderWithTheme(
        <BottomSheet
          visible={true}
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
    ).toThrow('expected onClose prop for `BottomSheet`');
  });
});
