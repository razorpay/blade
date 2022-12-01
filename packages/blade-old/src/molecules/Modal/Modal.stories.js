import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';
import Flex from '../../atoms/Flex';
import Text from '../../atoms/Text';
import Heading from '../../atoms/Heading';
import Space from '../../atoms/Space';
import Size from '../../atoms/Size';
import View from '../../atoms/View';
import Button from '../../atoms/Button';
import Modal from './Modal';

const HeaderPlaceholder = styled(View)`
  background-color: ${(props) => props.theme.bladeOld.colors.tone[940]};
`;

const ModalDemo = () => {
  const [centeredModalVisibility, setCenteredModalVisibility] = useState(false);
  const [fullscreenModalVisibility, setFullscreenModalVisibility] = useState(false);
  const [bottomsheetModalVisibility, setBottomsheetModalVisibility] = useState(false);
  return (
    <Flex flex={1} justifyContent="space-evenly" alignitems="center">
      <View>
        <Button
          onClick={() => {
            setCenteredModalVisibility(true);
            setFullscreenModalVisibility(false);
            setBottomsheetModalVisibility(false);
          }}
        >
          Toggle Centered Modal
        </Button>
        <Button
          onClick={() => {
            setCenteredModalVisibility(false);
            setFullscreenModalVisibility(true);
            setBottomsheetModalVisibility(false);
          }}
        >
          Toggle Fullscreen Modal
        </Button>
        <Button
          onClick={() => {
            setCenteredModalVisibility(false);
            setFullscreenModalVisibility(false);
            setBottomsheetModalVisibility(true);
          }}
        >
          Toggle Bottomsheet Modal
        </Button>

        {!(fullscreenModalVisibility || bottomsheetModalVisibility) ? (
          <Modal
            visible={centeredModalVisibility}
            onBackdropClick={() => setCenteredModalVisibility(false)}
            onClose={() => setCenteredModalVisibility(false)}
          >
            <Modal.Header>
              <Flex alignItems="center">
                <View>
                  <Size height="140px" width="100%">
                    <HeaderPlaceholder />
                  </Size>
                </View>
              </Flex>
            </Modal.Header>
            <Modal.Content>
              <Flex alignItems="center">
                <View>
                  <Heading size="large">Content Heading</Heading>
                  <Text size="medium" color="shade.980">
                    Here goes the description...
                  </Text>
                </View>
              </Flex>
            </Modal.Content>
            <Modal.Footer>
              <Flex flexDirection="row">
                <Space padding={[0, 0, 1.5, 0]}>
                  <View>
                    <Button block size="large">
                      Option 1
                    </Button>
                  </View>
                </Space>
              </Flex>
              <Flex flexDirection="row">
                <Space padding={[0, 0, 1.5, 0]}>
                  <View>
                    <Button block variant="secondary" size="large">
                      Option 2
                    </Button>
                  </View>
                </Space>
              </Flex>
              <Flex flexDirection="row">
                <View>
                  <Button block variant="tertiary" size="large">
                    Option 3
                  </Button>
                </View>
              </Flex>
            </Modal.Footer>
          </Modal>
        ) : null}
        {!(centeredModalVisibility || bottomsheetModalVisibility) ? (
          <Modal
            visible={fullscreenModalVisibility}
            variant="fullscreen"
            onClose={() => setFullscreenModalVisibility(false)}
          >
            <Modal.Header>
              <View>
                <Heading size="large" weight="regular">
                  Title
                </Heading>
                <Text size="xxsmall" color="shade.950">
                  Title Domain
                </Text>
              </View>
            </Modal.Header>
            <Modal.Content>
              <Flex flex={1}>
                <Space padding={[1, 2]}>
                  <View>
                    <Text>Content 1</Text>
                    <Text>Content 2</Text>
                    <Text>Content 3</Text>
                    <Text>Content 4</Text>
                    <Text>Content 5</Text>
                  </View>
                </Space>
              </Flex>
            </Modal.Content>
          </Modal>
        ) : null}
        {!(centeredModalVisibility || fullscreenModalVisibility) ? (
          <Modal
            visible={bottomsheetModalVisibility}
            variant="bottomsheet"
            onClose={() => setBottomsheetModalVisibility(false)}
          >
            <Modal.Header>
              <Flex alignItems="center">
                <View>
                  <Heading size="large">Title</Heading>
                </View>
              </Flex>
            </Modal.Header>
            <Modal.Content>
              <Space padding={[2]}>
                <View>
                  <Text>Content 1</Text>
                  <Text>Content 2</Text>
                  <Text>Content 3</Text>
                  <Text>Content 4</Text>
                  <Text>Content 5</Text>
                  <Text>Content 6</Text>
                  <Text>Content 7</Text>
                  <Text>Content 8</Text>
                  <Text>Content 9</Text>
                  <Text>Content 10</Text>
                </View>
              </Space>
            </Modal.Content>
            <Modal.Footer>
              <Flex flexDirection="row" justifyContent="space-between">
                <View>
                  <Button variant="tertiary">Option1</Button>
                  <Button>Option2</Button>
                </View>
              </Flex>
            </Modal.Footer>
          </Modal>
        ) : null}
      </View>
    </Flex>
  );
};

storiesOf('Modal', module)
  .addParameters({
    component: Modal,
  })
  .add('default', () => <ModalDemo />);
