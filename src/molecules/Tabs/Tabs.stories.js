import React from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';
import View from '../../atoms/View';
import Text from '../../atoms/Text';
import Flex from '../../atoms/Flex';
import Space from '../../atoms/Space';
import { getColorKeys } from '../../_helpers/theme';
import Tabs from './Tabs';

const Content = ({ children, color }) => {
  return (
    <Flex flex={1} alignItems="center">
      <Space padding={[16, 0, 0, 0]}>
        <View style={{}}>
          <Text color={color}>{children}</Text>
        </View>
      </Space>
    </Flex>
  );
};

Content.propTypes = {
  children: PropTypes.string,
  color: PropTypes.oneOf(getColorKeys()),
};

storiesOf('Tabs', module)
  .addParameters({
    component: Tabs,
  })
  .add('default', () => (
    <Tabs defaultValue="payments" disableSwipe={boolean('Disable Swipe', false)}>
      <Tabs.Tab value="payments" label="Payments" disabled={boolean('Disable Tab 1', false)}>
        <Content color="emerald.900">This is the Payments screen</Content>
      </Tabs.Tab>
      <Tabs.Tab
        value="payment_links"
        label="Payment Links"
        disabled={boolean('Disable Tab 2', false)}
      >
        <Content color="mustard.900">This is the Payment Links screen</Content>
      </Tabs.Tab>
      <Tabs.Tab value="settlements" label="Settlements" disabled={boolean('Disable Tab 3', false)}>
        <Content color="rose.900">This is the Settlements screen</Content>
      </Tabs.Tab>
    </Tabs>
  ));
