import React, { forwardRef } from 'react';
import { Dimensions } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { Modalize as RNModalize } from 'react-native-modalize';
import PropTypes from 'prop-types';
import Flex from '../../atoms/Flex';
import Space from '../../atoms/Space';
import Size from '../../atoms/Size';
import Position from '../../atoms/Position';
import View from '../../atoms/View';
import Divider from '../../atoms/Divider';

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
`;

const BottomSheetDragBar = styled(View)`
  background-color: ${(props) => props.theme.colors.shade[920]};
  border-radius: 4px;
`;

const BottomSheet = forwardRef(
  (
    {
      snapPoint = DEFAULT_SNAP_POINT,
      children = null,
      HeaderComponent = null,
      FooterComponent = null,
      onBackDropPress = () => {},
      onBackButtonPress = () => {},
      onOpened = () => {},
      onClosed = () => {},
      childrenStyle = {},
    },
    ref,
  ) => {
    const theme = useTheme();

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
            {HeaderComponent}
            <Divider color="shade.920" />
          </HeaderContainer>
        }
        FloatingComponent={
          FooterComponent ? (
            <Position position="absolute" bottom={0} left={0} right={0} zIndex={2}>
              <View>
                <Divider color="shade.920" />
                {FooterComponent}
              </View>
            </Position>
          ) : null
        }
        overlayStyle={styles.overlayStyle({ theme })}
        onOverlayPress={onBackDropPress}
        avoidKeyboardLikeIOS={true}
        onOpened={onOpened}
        onClosed={onClosed}
        onBackButtonPress={onBackButtonPress}
        childrenStyle={{ ...styles.childrenStyle({ theme }), childrenStyle }}
        withHandle={false}
        panGestureComponentEnabled={true}
      >
        {children}
      </RNModalize>
    );
  },
);

BottomSheet.displayName = 'BladeBottomSheet';

BottomSheet.propTypes = {
  snapPoint: PropTypes.number,
  children: PropTypes.node,
  HeaderComponent: PropTypes.node,
  FooterComponent: PropTypes.node,
  onOpened: PropTypes.func,
  onClosed: PropTypes.func,
  onBackButtonPress: PropTypes.func,
  onBackDropPress: PropTypes.func,
  childrenStyle: PropTypes.object,
};

export default BottomSheet;
