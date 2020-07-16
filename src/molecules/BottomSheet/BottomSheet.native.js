import React, { forwardRef, useState, useCallback } from 'react';
import { Dimensions } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { Modalize as RNModalize } from 'react-native-modalize';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import Flex from '../../atoms/Flex';
import Space from '../../atoms/Space';
import Size from '../../atoms/Size';
import View from '../../atoms/View';
import Divider from '../../atoms/Divider';
import reactChildrenGroupByType from '../../_helpers/reactChildrenGroupByType';
import Position from '../../atoms/Position';
import Header from './BottomSheetHeader';
import Footer from './BottomSheetFooter';
import Content from './BottomSheetContent';

const screenHeight = Dimensions.get('window').height;
const DEFAULT_SNAP_POINT = screenHeight * 0.4; // 40% of screen height
const linearGradientLocations = [0, 0.2969, 1]; // 0%, 29.69%, 100%

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
  linearGradient: () => {
    return {
      transform: [
        {
          scaleX: 1,
        },
        { scaleY: -1 },
      ],
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
      adjustToContentHeight = false,
      alwaysOpen = 0,
    },
    ref,
  ) => {
    const theme = useTheme();
    const [headerHeight, setHeaderHeight] = useState(0);
    const [contentHeight, setContentHeight] = useState(0);
    const bottomsheetChildrenGroupByType = reactChildrenGroupByType(children);

    const headerComponent = bottomsheetChildrenGroupByType[Header];
    const footerComponent = bottomsheetChildrenGroupByType[Footer];
    const contentComponent = bottomsheetChildrenGroupByType[Content];

    if (headerComponent?.length > 1) {
      throw new Error(
        `expected to have single \`BottomSheet.Header\` but found ${headerComponent.length}`,
      );
    }

    if (footerComponent?.length > 1) {
      throw new Error(
        `expected to have single \`BottomSheet.Footer\` but found ${footerComponent.length}`,
      );
    }

    const handleHeaderLayoutChange = useCallback((e) => {
      setHeaderHeight(e.nativeEvent.layout.height);
    }, []);

    const handleContentLayoutChange = useCallback((e) => {
      setContentHeight(e.nativeEvent.layout.height);
    }, []);

    let contentContainerHeight = DEFAULT_SNAP_POINT - headerHeight;
    if (alwaysOpen > 0) {
      contentContainerHeight = alwaysOpen - headerHeight;
    }
    const isScrollableContent = contentHeight > contentContainerHeight;

    return (
      <RNModalize
        ref={ref}
        snapPoint={snapPoint}
        HeaderComponent={
          <View onLayout={handleHeaderLayoutChange}>
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
              {headerComponent?.length ? (
                <>
                  {headerComponent}
                  <Divider color="shade.920" horizontal />
                </>
              ) : null}
            </HeaderContainer>
          </View>
        }
        FloatingComponent={
          <Position position="absolute" left={0} right={0} bottom={0}>
            <View>
              {isScrollableContent && (
                <LinearGradient
                  locations={linearGradientLocations}
                  colors={[
                    'rgba(249, 251, 254, 1)',
                    'rgba(249, 251, 254, 0.6)',
                    'rgba(249, 251, 254, 0)',
                  ]}
                  useAngle={true}
                  angle={180}
                  style={styles.linearGradient()}
                >
                  <Size height={7}>
                    <View />
                  </Size>
                </LinearGradient>
              )}
              {footerComponent?.length ? footerComponent : null}
            </View>
          </Position>
        }
        overlayStyle={styles.overlayStyle({ theme })}
        onOverlayPress={onBackDropPress}
        avoidKeyboardLikeIOS={true}
        onOpened={onOpened}
        onClosed={onClosed}
        onBackButtonPress={onBackButtonPress}
        childrenStyle={styles.childrenStyle({ theme })}
        withHandle={false}
        panGestureComponentEnabled={true}
        adjustToContentHeight={adjustToContentHeight}
        alwaysOpen={alwaysOpen}
      >
        <View onLayout={handleContentLayoutChange}>{contentComponent}</View>
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
  adjustToContentHeight: PropTypes.bool,
  alwaysOpen: PropTypes.number,
};

export default BottomSheet;
