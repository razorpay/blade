import React, { forwardRef } from 'react';
import { View, Text, Dimensions } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { Modalize as RNModalize } from 'react-native-modalize';
import PropTypes from 'prop-types';
import Flex from '../../atoms/Flex';
import Space from '../../atoms/Space';
import Size from '../../atoms/Size';
import Position from '../../atoms/Position';

const screenHeight = Dimensions.get('window').height;

const DEFAULT_SNAP_POINT = screenHeight * 0.4; // 40% of screen height
const styles = {
  overlayStyle: ({ theme }) => {
    return {
      backgroundColor: theme.colors.shade[950],
    };
  },
};

const HeaderContainer = styled(View)`
  background-color: ${(props) => props.theme.colors.background[200]};
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  box-shadow: ${(props) => `0px -4px 15px ${props.theme.colors.primary[930]}`};
`;

const FooterContainer = styled(View)`
  border-top-color: ${(props) => props.theme.colors.shade[920]};
  border-top-width: 1px;
`;

const BottomSheetDragBar = styled(View)`
  background-color: ${(props) => props.theme.colors.shade[920]};
  border-radius: 4px;
`;

const Modalize = forwardRef(
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
          </HeaderContainer>
        }
        FloatingComponent={
          FooterComponent ? (
            <Position position="absolute" bottom={0} left={0} right={0} zIndex={2}>
              <FooterContainer>
                <View>
                  <Text>shridhar</Text>
                </View>
                {FooterComponent}
              </FooterContainer>
            </Position>
          ) : null
        }
        overlayStyle={styles.overlayStyle({ theme })}
        onOverlayPress={onBackDropPress}
        avoidKeyboardLikeIOS={true}
        onOpened={onOpened}
        onClosed={onClosed}
        onBackButtonPress={onBackButtonPress}
        withHandle={false}
      >
        {children}
      </RNModalize>
    );
  },
);

Modalize.displayName = 'Modalize';

Modalize.propTypes = {
  snapPoint: PropTypes.number,
  children: PropTypes.node,
  HeaderComponent: PropTypes.node,
  FooterComponent: PropTypes.node,
  onOpened: PropTypes.func,
  onClosed: PropTypes.func,
  onBackButtonPress: PropTypes.func,
  onBackDropPress: PropTypes.func,
};

export default Modalize;
