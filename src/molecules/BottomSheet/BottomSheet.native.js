import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
//import { Dimensions } from 'react-native';
import ReanimatedBottomSheet from 'reanimated-bottom-sheet';
import Animated, { Value } from 'react-native-reanimated';
//import RNModal from 'react-native-modal';
import styled from 'styled-components/native';
import Flex from '../../atoms/Flex';
import View from '../../atoms/View';
//import Text from '../../atoms/Text';
//import ScrollView from '../../atoms/ScrollView';
//import TextInput from '../../atoms/TextInput';
import Space from '../../atoms/Space';
import Size from '../../atoms/Size';
import Position from '../../atoms/Position';

const AnimatedView = Animated.View;
//const screenHeight = Dimensions.get('window').height;
//const screenWidth = Dimensions.get('window').width;

const BottomSheetDragBar = styled(View)`
  background-color: ${(props) => props.theme.colors.shade[920]};
  border-radius: 4px;
`;

const HeaderContainer = styled(View)`
  background-color: ${(props) => props.theme.colors.background[200]};
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
`;

// const Item = styled(View)`
//   padding: 16px;
// `;

const BottomSheet = ({ snapPoints, initialSnap, header, content, footer }) => {
  const bottomsheetRef = useRef(null);
  const fall = new Value(1);
  //const x = new Value(0);
  const [showFooter, setShowFooter] = useState(!!footer);

  const renderHeader = () => {
    return (
      <Flex alignItems="center">
        <Space padding={[1, 0, 1.5, 0]}>
          <HeaderContainer>
            <Size height={0.5} width={8}>
              <BottomSheetDragBar />
            </Size>
            {header}
          </HeaderContainer>
        </Space>
      </Flex>
    );
  };

  const renderContent = () => {
    return (
      <View style={{ height: '100%' }}>
        {content}
        {/* <View style={{ backgroundColor: 'white' }}>
          <Item>
            <Text>Tottenham</Text>
          </Item>
          <Item>
            <Text>Arsenal</Text>
          </Item>
          <Item>
            <Text>Manchester United</Text>
          </Item>
          <Item>
            <Text>Manchester City</Text>
          </Item>
          <Item>
            <Text>Chelsea</Text>
          </Item>
          <Item>
            <Text>Liverpool</Text>
          </Item>
          <Item>
            <Text>Wolves</Text>
          </Item>

          <Item>
            <Text>Wolves</Text>
          </Item>
          <Item>
            <Text>Wolves</Text>
          </Item>
          <Item>
            <Text>Wolves</Text>
          </Item>
          <Item>
            <Text>Wolves</Text>
          </Item>
          <Item>
            <Text>Wolves</Text>
          </Item>
        </View> */}
      </View>
    );
  };

  const onCloseEnd = () => {
    setShowFooter(false);
  };

  const renderBackdrop = () => {
    const animatedShadowOpacity = Animated.interpolate(fall, {
      inputRange: [0, 1],
      outputRange: [0.5, 0],
    });
    return (
      <Position position="absolute" top={0} left={0} bottom={0} right={0}>
        <AnimatedView
          style={[
            {
              backgroundColor: '#6f6f76',
            },
            {
              opacity: animatedShadowOpacity,
            },
          ]}
        />
      </Position>
    );
  };
  // const animatedBackdropOpacity = Animated.interpolate(fall, {
  //   inputRange: [0, 1],
  //   outputRange: [1, 0],
  // });

  return (
    <Flex flex={1}>
      <View>
        <ReanimatedBottomSheet
          ref={bottomsheetRef}
          snapPoints={snapPoints}
          renderHeader={renderHeader}
          renderContent={renderContent}
          initialSnap={initialSnap}
          onCloseEnd={onCloseEnd}
          callbackNode={fall}
        />
        {renderBackdrop()}
        {/* <Position position="absolute" top={0} left={0} bottom={0} right={0}>
          <AnimatedView
            style={{
              backgroundColor: 'red',
              opacity: animatedBackdropOpacity,
            }}
          />
        </Position> */}

        {showFooter ? (
          <Position position="absolute" left={0} bottom={0} right={0}>
            <View
              style={{
                backgroundColor: 'aqua',
                zIndex: 102,
              }}
            >
              {footer}
            </View>
          </Position>
        ) : null}
      </View>
    </Flex>
  );
};

BottomSheet.propTypes = {
  snapPoints: PropTypes.array,
  initialSnap: PropTypes.number,
  header: PropTypes.node,
  content: PropTypes.node,
  footer: PropTypes.node,
};

BottomSheet.defaultProps = {
  snapPoints: ['75%', '30%', '15%', '-20%'],
  initialSnap: 1,
  header: null,
  content: null,
  footer: null,
};

export default BottomSheet;
