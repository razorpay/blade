import React from 'react';
import BottomSheet from '../BottomSheet';
import { renderWithTheme } from '../../../_helpers/testing';
import View from '../../../atoms/View';
import Text from '../../../atoms/Text';

const list = [
  'Apple',
  'Asus',
  'Blackberry',
  'Honor',
  'HTC',
  'Huawei',
  'Lava',
  'Lenovo',
  'LG',
  'Motorola',
  'Nexus',
  'Nokia',
  'OnePlus',
  'Oppo',
  'Panasonic',
  'Pixel',
  'Realme',
  'Samsung',
  'Sony',
  'Toshiba',
  'Vivo',
  'Xiaomi',
];

export const sections = [
  {
    title: 'Section1',
    data: list,
  },
  {
    title: 'Section2',
    data: list,
  },
];

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
      <BottomSheet visible={true} onClose={mockOnClose}>
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
      <BottomSheet visible={true} initialHeight={300} onClose={() => {}}>
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
    const data = new Array(list.length).fill({}).map((item, index) => ({
      id: index,
      name: list[index],
    }));

    const { container } = renderWithTheme(
      <BottomSheet visible={true} onClose={mockOnClose}>
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

  it('renders non-scrollable bottomsheet', () => {
    const nonScrollableList = [
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

    const data = new Array(nonScrollableList.length).fill({}).map((item, index) => ({
      id: index,
      name: nonScrollableList[index],
    }));

    const { container } = renderWithTheme(
      <BottomSheet visible={true} onClose={mockOnClose} adjustToContentHeight>
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
        <BottomSheet visible={true} onClose={mockOnClose}>
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
        <BottomSheet visible={true} onClose={mockOnClose}>
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
        <BottomSheet visible={true}>
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

  it('renders BottomSheet with SectionList', () => {
    const { container } = renderWithTheme(
      <BottomSheet visible={true} initialHeight={300} onClose={() => {}}>
        <BottomSheet.SectionList
          sections={sections}
          renderItem={({ item }) => (
            <View>
              <Text>{item}</Text>
            </View>
          )}
          renderSectionHeader={({ section }) => (
            <View>
              <Text>{section.title}</Text>
            </View>
          )}
          keyExtractor={(item) => item}
        />
      </BottomSheet>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders BottomSheet with SectionList and Footer', () => {
    const { container } = renderWithTheme(
      <BottomSheet visible={true} initialHeight={300} onClose={() => {}}>
        <BottomSheet.SectionList
          sections={sections}
          renderItem={({ item }) => (
            <View>
              <Text>{item}</Text>
            </View>
          )}
          renderSectionHeader={({ section }) => (
            <View>
              <Text>{section.title}</Text>
            </View>
          )}
          keyExtractor={(item) => item}
        />
        <BottomSheet.Footer>
          <View>
            <Text>Footer1</Text>
          </View>
        </BottomSheet.Footer>
      </BottomSheet>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should throw error when both Content and SectionList are provided', () => {
    expect(() =>
      renderWithTheme(
        <BottomSheet visible={true} initialHeight={300} onClose={() => {}}>
          <BottomSheet.SectionList
            sections={sections}
            renderItem={({ item }) => (
              <View>
                <Text>{item}</Text>
              </View>
            )}
            renderSectionHeader={({ section }) => (
              <View>
                <Text>{section.title}</Text>
              </View>
            )}
            keyExtractor={(item) => item}
          />
          <BottomSheet.Content>
            <View>
              <Text>Bottomsheet content</Text>
            </View>
          </BottomSheet.Content>
        </BottomSheet>,
      ),
    ).toThrow(
      'expected to have one of `BottomSheet.Content or BottomSheet.SectionList` but found both',
    );
  });

  it('should throw error when multiple SectionList are provided', () => {
    expect(() =>
      renderWithTheme(
        <BottomSheet visible={true} initialHeight={300} onClose={() => {}}>
          <BottomSheet.SectionList
            sections={sections}
            renderItem={({ item }) => (
              <View>
                <Text>{item}</Text>
              </View>
            )}
            renderSectionHeader={({ section }) => (
              <View>
                <Text>{section.title}</Text>
              </View>
            )}
            keyExtractor={(item) => item}
          />
          <BottomSheet.SectionList
            sections={sections}
            renderItem={({ item }) => (
              <View>
                <Text>{item}</Text>
              </View>
            )}
            renderSectionHeader={({ section }) => (
              <View>
                <Text>{section.title}</Text>
              </View>
            )}
            keyExtractor={(item) => item}
          />
        </BottomSheet>,
      ),
    ).toThrow('expected to have single `BottomSheet.SectionList` but found but found 2');
  });
});
