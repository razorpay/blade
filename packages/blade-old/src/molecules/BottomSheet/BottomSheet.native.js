import React, { useRef, useState, useCallback, useEffect } from 'react';
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
import reactChildrenGroupByDisplayName from '../../_helpers/reactChildrenGroupByDisplayName';
import Position from '../../atoms/Position';
import BottomSheetHeader from './BottomSheetHeader';
import BottomSheetFooter from './BottomSheetFooter';
import BottomSheetContent from './BottomSheetContent';
import BottomSheetSectionList from './BottomSheetSectionList';

const screenHeight = Dimensions.get('window').height;
const DEFAULT_SNAP_POINT = screenHeight * 0.4; // 40% of screen height
const linearGradientLocations = [0.1, 0.2969, 1]; // 0%, 29.69%, 100%

const styles = {
  rootStyle: ({ theme }) => {
    return {
      elevation: 5,
      shadowColor: theme.bladeOld.colors.primary[930],
      shadowOffset: {
        width: 0,
        height: -4,
      },
      shadowOpacity: 0.8,
      shadowRadius: 15,
    };
  },
  overlayStyle: ({ theme }) => {
    return {
      backgroundColor: theme.bladeOld.colors.overlay[100],
    };
  },
  childrenStyle: ({ theme, isSectionList }) => {
    const childrenStyles = {
      backgroundColor: theme.bladeOld.colors.background[300],
    };
    if (isSectionList) {
      return {
        ...childrenStyles,
        ...{
          paddingVertical: 8,
          paddingHorizontal: 16,
        },
      };
    }
    return childrenStyles;
  },
  linearGradient: (): {
    transform: (
      | {
          scaleX: number,
          scaleY?: undefined,
        }
      | {
          scaleY: number,
          scaleX?: undefined,
        }
    )[],
  } => {
    return {
      transform: [
        {
          scaleX: 1,
        },
        {
          scaleY: -1,
        },
      ],
    };
  },
};

const HeaderContainer = styled(View)`
  background-color: ${(props) => props.theme.bladeOld.colors.background[300]};
  border-top-right-radius: ${(props) => props.theme.bladeOld.spacings.small};
  border-top-left-radius: ${(props) => props.theme.bladeOld.spacings.small};
`;

const BottomSheetDragBar = styled(View)`
  background-color: ${(props) => props.theme.bladeOld.colors.overlay[50]};
  border-radius: ${(props) => props.theme.bladeOld.spacings.xsmall};
`;

const BottomSheet = ({
  visible = false,
  snapPoint = DEFAULT_SNAP_POINT,
  children,
  onBackDropClick = () => {},
  onChange = () => {},
  onClose,
  adjustToContentHeight = false,
  initialHeight = 0,
}) => {
  const theme = useTheme();
  const bottomSheetRef = useRef();
  const bottomSheetVisibility = useRef(visible);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const bottomsheetChildrenGroupByDisplayName = reactChildrenGroupByDisplayName(children);

  const headerComponent = bottomsheetChildrenGroupByDisplayName.BottomSheetHeader;
  const footerComponent = bottomsheetChildrenGroupByDisplayName.BottomSheetFooter;
  const contentComponent = bottomsheetChildrenGroupByDisplayName.BottomSheetContent;
  const sectionListComponent = bottomsheetChildrenGroupByDisplayName.BottomSheetSectionList;

  useEffect(() => {
    if (visible) {
      // eslint-disable-next-line babel/no-unused-expressions
      bottomSheetRef.current?.open();
    } else {
      // eslint-disable-next-line babel/no-unused-expressions
      bottomSheetRef.current?.close();
    }
    bottomSheetVisibility.current = visible;
  }, [visible]);

  if (!onClose) {
    throw Error(`expected onClose prop for \`BottomSheet\``);
  }

  if (sectionListComponent && contentComponent) {
    throw Error(
      `expected to have one of \`BottomSheet.Content or BottomSheet.SectionList\` but found both`,
    );
  }

  if (sectionListComponent?.length > 1) {
    throw Error(
      `expected to have single \`BottomSheet.SectionList\` but found but found ${sectionListComponent.length}`,
    );
  }

  if (headerComponent?.length > 1) {
    throw Error(
      `expected to have single \`BottomSheet.Header\` but found ${headerComponent.length}`,
    );
  }

  if (footerComponent?.length > 1) {
    throw Error(
      `expected to have single \`BottomSheet.Footer\` but found ${footerComponent.length}`,
    );
  }

  const handleHeaderLayoutChange = useCallback(({ nativeEvent }) => {
    setHeaderHeight(nativeEvent.layout.height);
  }, []);

  const handleContentLayoutChange = useCallback(({ nativeEvent }) => {
    setContentHeight(nativeEvent.layout.height);
  }, []);

  let contentContainerHeight = DEFAULT_SNAP_POINT - headerHeight;
  if (initialHeight > 0) {
    contentContainerHeight = initialHeight - headerHeight;
  }
  // scrollable is always false when adjustToContentHeight={true}
  const isScrollableContent = adjustToContentHeight
    ? false
    : contentHeight > contentContainerHeight;

  const handleBottomSheetClose = () => {
    if (onClose && typeof onClose === 'function') {
      onClose();
      setTimeout(() => {
        if (bottomSheetVisibility.current) {
          // eslint-disable-next-line babel/no-unused-expressions
          bottomSheetRef.current?.open();
        }
      }, 100);
    }
  };

  return (
    <RNModalize
      ref={bottomSheetRef}
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
                <Divider color="overlay.50" direction="horizontal" />
              </>
            ) : null}
          </HeaderContainer>
        </View>
      }
      FooterComponent={footerComponent?.length ? <View>{footerComponent}</View> : null}
      FloatingComponent={
        isScrollableContent ? (
          <Position position="absolute" left={0} right={0} bottom={0}>
            <Size height={7}>
              <LinearGradient
                locations={linearGradientLocations}
                colors={[
                  theme.bladeOld.colors.primary[930],
                  theme.bladeOld.colors.primary[920],
                  'rgba(255, 255, 255, 0)',
                ]}
                style={styles.linearGradient()}
              />
            </Size>
          </Position>
        ) : null
      }
      overlayStyle={styles.overlayStyle({
        theme,
      })}
      onOverlayPress={onBackDropClick}
      avoidKeyboardLikeIOS={true}
      onPositionChange={onChange}
      onClosed={handleBottomSheetClose}
      childrenStyle={styles.childrenStyle({
        theme,
        isSectionList: Boolean(sectionListComponent),
      })}
      withHandle={false}
      panGestureComponentEnabled={true}
      adjustToContentHeight={adjustToContentHeight}
      alwaysOpen={initialHeight}
      rootStyle={styles.rootStyle({
        theme,
      })}
      sectionListProps={sectionListComponent?.[0].props}
    >
      {!sectionListComponent ? (
        <View onLayout={handleContentLayoutChange}>{contentComponent}</View>
      ) : null}
    </RNModalize>
  );
};

BottomSheet.displayName = 'BladeBottomSheet';
BottomSheet.Header = BottomSheetHeader;
BottomSheet.Footer = BottomSheetFooter;
BottomSheet.Content = BottomSheetContent;
BottomSheet.SectionList = BottomSheetSectionList;

BottomSheet.propTypes = {
  visible: PropTypes.bool,
  snapPoint: PropTypes.number,
  children: PropTypes.node,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  onBackDropClick: PropTypes.func,
  adjustToContentHeight: PropTypes.bool,
  initialHeight: PropTypes.number,
};

export default BottomSheet;
