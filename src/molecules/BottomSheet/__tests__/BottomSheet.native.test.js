import React from 'react';
import { act } from '@testing-library/react-native';
import BottomSheet from '../BottomSheet';
import { renderWithTheme } from '../../../_helpers/testing';
import View from '../../../atoms/View';
import Text from '../../../atoms/Text';

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
        HeaderComponent={
          <View>
            <Text>Header</Text>
          </View>
        }
        FooterComponent={
          <View>
            <Text>Footer</Text>
          </View>
        }
      >
        <View>
          <Text>Bottomsheet content</Text>
        </View>
      </BottomSheet>,
    );
    act(() => {
      bottomSheetRef.current.open();
    });
    expect(container).toMatchSnapshot();
  });
});
