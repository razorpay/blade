import React, { forwardRef } from 'react';
import { Dimensions } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { Modalize as RNModalize } from 'react-native-modalize';
import PropTypes from 'prop-types';
import Flex from '../../atoms/Flex';
import Space from '../../atoms/Space';
import Size from '../../atoms/Size';
import View from '../../atoms/View';
import Divider from '../../atoms/Divider';
import reactChildrenGroupByType from '../../_helpers/reactChildrenGroupByType';
import Header from './BottomSheetHeader';
import Footer from './BottomSheetFooter';
import Content from './BottomSheetContent';

const screenHeight = Dimensions.get('window').height;
const DEFAULT_SNAP_POINT = screenHeight * 0.4; // 40% of screen height

const styles = {
  overlayStyle: ({ theme }) => {
    return {
      backgroundColor: theme.colors.shade[950],
    };
  },
  childrenStyle: ({ theme }) => {
    return {
      backgroundColor: theme.colors.background[200],
    };
  },
};

const HeaderContainer = styled(View)`
  background-color: ${(props) => props.theme.colors.background[200]};
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  box-shadow: ${(props) => `0px -4px 15px ${props.theme.colors.primary[930]}`};
  elevation: 4;
`;

const BottomSheetDragBar = styled(View)`
  background-color: ${(props) => props.theme.colors.shade[920]};
  border-radius: 4px;
`;

const BottomSheet = forwardRef(
  (
    {
      snapPoint = DEFAULT_SNAP_POINT,
      children,
      onBackDropPress = () => {},
      onBackButtonPress = () => {},
      onOpened = () => {},
      onClosed = () => {},
      childrenStyle = {},
      adjustToContentHeight = false,
      overlayStyle = {},
      alwaysOpen = 0,
    },
    ref,
  ) => {
    const theme = useTheme();
    const bottomsheetChildrenGroupByType = reactChildrenGroupByType(children);

    const headerComponent = bottomsheetChildrenGroupByType[Header];
    const footerComponent = bottomsheetChildrenGroupByType[Footer];
    const contentComponent = bottomsheetChildrenGroupByType[Content];

    if (headerComponent.length > 1) {
      throw new Error(
        `expected to have single \`BottomSheet.Header\` but found ${headerComponent.length}`,
      );
    }

    if (footerComponent.length > 1) {
      throw new Error(
        `expected to have single \`BottomSheet.Footer\` but found ${footerComponent.length}`,
      );
    }

    return (
      <RNModalize
        ref={ref}
        snapPoint={snapPoint}
        HeaderComponent={
          <HeaderContainer>
            <Flex alignItems="center">
              <Space padding={[1, 0, 1.5, 0]}>
                <View>
                  <Size height={0.5} width={8}>
                    <BottomSheetDragBar />
                  </Size>
                </View>
              </Space>
            </Flex>
            {headerComponent ? (
              <>
                {headerComponent}
                <Divider color="shade.920" horizontal />
              </>
            ) : null}
          </HeaderContainer>
        }
        FloatingComponent={footerComponent ? footerComponent : null}
        overlayStyle={{ ...styles.overlayStyle({ theme }), ...overlayStyle }}
        onOverlayPress={onBackDropPress}
        avoidKeyboardLikeIOS={true}
        onOpened={onOpened}
        onClosed={onClosed}
        onBackButtonPress={onBackButtonPress}
        childrenStyle={{ ...styles.childrenStyle({ theme }), ...childrenStyle }}
        withHandle={false}
        panGestureComponentEnabled={true}
        adjustToContentHeight={adjustToContentHeight}
        alwaysOpen={alwaysOpen}
      >
        {contentComponent}
      </RNModalize>
    );
  },
);

BottomSheet.displayName = 'BladeBottomSheet';
BottomSheet.Header = Header;
BottomSheet.Footer = Footer;
BottomSheet.Content = Content;

BottomSheet.propTypes = {
  snapPoint: PropTypes.number,
  children: PropTypes.node,
  onOpened: PropTypes.func,
  onClosed: PropTypes.func,
  onBackButtonPress: PropTypes.func,
  onBackDropPress: PropTypes.func,
  childrenStyle: PropTypes.object,
  adjustToContentHeight: PropTypes.bool,
  overlayStyle: PropTypes.object,
  alwaysOpen: PropTypes.number,
};

export default BottomSheet;
