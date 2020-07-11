import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { Modalize as RNModalize } from 'react-native-modalize';
import PropTypes from 'prop-types';
//import Animated from 'react-native-reanimated';
import Flex from '../../atoms/Flex';
import Space from '../../atoms/Space';
import Size from '../../atoms/Size';
//import Tabs from '../Tabs';
import TextInput from '../../atoms/TextInput';

const screenHeight = Dimensions.get('window').height;

const DEFAULT_SNAP_POINT = screenHeight * 0.4;
const styles = {
  overlayStyle: ({ theme }) => {
    return {
      backgroundColor: theme.colors.shade[950],
    };
  },
  handleBarStyle: () => {
    return {
      display: 'none',
    };
  },
};

/*const Content = ({ children, color }) => {
  return (
    <Flex flex={1} alignItems="center">
      <Space padding={[16, 0, 0, 0]}>
        <View>
          <Text color={color}>{children}</Text>
        </View>
      </Space>
    </Flex>
  );
};*/
/*const renderTabsComponent = () => {
  return (
    <Tabs defaultValue="payments">
      <Tabs.Tab value="payments" title="Payments">
        <Content color="emerald.900">This is the Payments screen</Content>
      </Tabs.Tab>
      <Tabs.Tab value="payment-links" title="Payment Links">
        <Content color="mustard.900">This is the Payment Links screen</Content>
      </Tabs.Tab>
      <Tabs.Tab value="settlements" title="Settlements">
        <Content color="rose.900">This is the Settlements screen</Content>
      </Tabs.Tab>
    </Tabs>
  );
};*/

const HeaderContainer = styled(View)`
  background-color: ${(props) => props.theme.colors.background[200]};
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
`;

const BottomSheetDragBar = styled(View)`
  background-color: ${(props) => props.theme.colors.shade[920]};
  border-radius: 4px;
`;

const Modalize = ({
  //children = null,
  HeaderComponent = null,
  FooterComponent = null,
  onBackDropPress,
  snapPoint = DEFAULT_SNAP_POINT,
}) => {
  const theme = useTheme();
  const modalizeRef = useRef(null);

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  return (
    <>
      <TouchableOpacity onPress={onOpen}>
        <Text>Open BottomSheet</Text>
      </TouchableOpacity>
      <RNModalize
        ref={modalizeRef}
        snapPoint={snapPoint}
        HeaderComponent={
          <View>
            <Flex alignItems="center">
              <Space padding={[1, 0, 1.5, 0]}>
                <HeaderContainer>
                  <Size height={0.5} width={8}>
                    <BottomSheetDragBar />
                  </Size>
                </HeaderContainer>
              </Space>
            </Flex>
            {HeaderComponent}
          </View>
        }
        FloatingComponent={
          <View
            style={{
              padding: 20,
              width: '100%',
              alignItems: 'center',
              position: 'absolute',
              bottom: 0,
              zIndex: 2,
              backgroundColor: 'aqua',
            }}
          >
            {FooterComponent}
          </View>
        }
        overlayStyle={styles.overlayStyle({ theme })}
        handleStyle={styles.handleBarStyle()}
        onOverlayPress={onBackDropPress}
      >
        {/* {children} */}
        <View>
          <View style={{ height: 40 }}>
            <Text>Manchester City</Text>
          </View>
          <TextInput value="shridhar" />
          <View style={{ height: 40 }}>
            <Text>Manchester United</Text>
          </View>
          <View style={{ height: 40 }}>
            <Text>Chelsea</Text>
          </View>
          <View style={{ height: 40 }}>
            <Text>Liverpool</Text>
          </View>
        </View>
        {/* {renderTabsComponent()} */}
      </RNModalize>
    </>
  );
};

Modalize.propTypes = {
  onBackDropPress: PropTypes.func,
  snapPoint: PropTypes.number,
  HeaderComponent: PropTypes.node,
  FooterComponent: PropTypes.node,
  //children: PropTypes.node,
};

export default Modalize;
