import React, { forwardRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Dimensions } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { Modalize as RNModalize } from 'react-native-modalize';
import LinearGradient from 'react-native-linear-gradient';
import View from '../../atoms/View';
import Flex from '../../atoms/Flex';
import Space from '../../atoms/Space';
import Size from '../../atoms/Size';
import Divider from '../../atoms/Divider';
import reactChildrenGroupByType from '../../_helpers/reactChildrenGroupByType';
import Position from '../../atoms/Position';
import BottomSheetHeader from './BottomSheetHeader';
import BottomSheetFooter from './BottomSheetFooter';
import BottomSheetContent from './BottomSheetContent';

const screenHeight = Dimensions.get('window').height;
const DEFAULT_SNAP_POINT = screenHeight * 0.4; // 40% of screen height
const linearGradientLocations = [0, 0.2969, 1]; // 0%, 29.69%, 100%

const styles = {
  rootStyle: () => {
    return {
      elevation: 5, // to be removed once Home TabsBottomSheet is changed
    };
  },
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
  border-top-right-radius: ${(props) => props.theme.spacings.small};
  border-top-left-radius: ${(props) => props.theme.spacings.small};
  box-shadow: ${(props) => `0px -4px 15px ${props.theme.colors.primary[930]}`};
  elevation: 5;
`;

const BottomSheetDragBar = styled(View)`
  background-color: ${(props) => props.theme.colors.shade[920]};
  border-radius: ${(props) => props.theme.spacings.xsmall};
`;

const BottomSheet = forwardRef(
  (
    {
      snapPoint = DEFAULT_SNAP_POINT,
      children,
      onBackDropClick = () => {},
      onBackButtonClick = () => {},
      onChange = () => {},
      onClosed = () => {},
      adjustToContentHeight = false,
      initialHeight = 0,
    },
    ref,
  ) => {
    const theme = useTheme();
    const [headerHeight, setHeaderHeight] = useState(0);
    const [contentHeight, setContentHeight] = useState(0);
    const bottomsheetChildrenGroupByType = reactChildrenGroupByType(children);

    const headerComponent = bottomsheetChildrenGroupByType[BottomSheetHeader];
    const footerComponent = bottomsheetChildrenGroupByType[BottomSheetFooter];
    const contentComponent = bottomsheetChildrenGroupByType[BottomSheetContent];

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
    if (initialHeight > 0) {
      contentContainerHeight = initialHeight - headerHeight;
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
                <Size height={7}>
                  <LinearGradient
                    locations={linearGradientLocations}
                    colors={[
                      theme.colors.primary[930],
                      theme.colors.primary[920],
                      theme.colors.primary[910],
                    ]}
                    useAngle={true}
                    angle={180}
                    style={styles.linearGradient()}
                  />
                </Size>
              )}
              {footerComponent?.length ? footerComponent : null}
            </View>
          </Position>
        }
        overlayStyle={styles.overlayStyle({ theme })}
        onOverlayPress={onBackDropClick}
        avoidKeyboardLikeIOS={true}
        onPositionChange={onChange}
        onClosed={onClosed}
        onBackButtonPress={onBackButtonClick}
        childrenStyle={styles.childrenStyle({ theme })}
        withHandle={false}
        panGestureComponentEnabled={true}
        adjustToContentHeight={adjustToContentHeight}
        alwaysOpen={initialHeight}
        rootStyle={styles.rootStyle()}
      >
        <View onLayout={handleContentLayoutChange}>{contentComponent}</View>
      </RNModalize>
    );
  },
);

BottomSheet.displayName = 'BladeBottomSheet';
BottomSheet.Header = BottomSheetHeader;
BottomSheet.Footer = BottomSheetFooter;
BottomSheet.Content = BottomSheetContent;

BottomSheet.propTypes = {
  snapPoint: PropTypes.number,
  children: PropTypes.node,
  onChange: PropTypes.func,
  onClosed: PropTypes.func,
  onBackButtonClick: PropTypes.func,
  onBackDropClick: PropTypes.func,
  adjustToContentHeight: PropTypes.bool,
  initialHeight: PropTypes.number,
};

export default BottomSheet;
