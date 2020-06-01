import React from 'react';
import { storiesOf } from '@storybook/react';
import { select, text, number, boolean } from '@storybook/addon-knobs';
import Flex from '../../atoms/Flex';
import View from '../../atoms/View';
import Button from '../../atoms/Button';
import { getIconNames } from '../../_helpers/icon';
import Snackbar from './Snackbar';
import { useSnackbar } from './SnackbarContext';
import SnackbarProvider from './SnackbarProvider';

const variantOptions = {
  positive: 'positive',
  negative: 'negative',
  warning: 'warning',
  neutral: 'neutral',
};

const iconOptions = getIconNames().reduce(
  (options, option) => ({ ...options, [option]: option }),
  {},
);

const SnackDemo = (props) => {
  const snackbar = useSnackbar();

  return (
    <Flex flex={1}>
      <View>
        <Flex justifyContent="space-around" flexDirection="column" flex={0.5} flexWrap="wrap">
          <View>
            <Button
              onClick={() =>
                snackbar.show({
                  ...props,
                })
              }
            >
              Show Snackbar
            </Button>
            <Button
              variant="primary"
              variantColor="shade"
              onClick={() =>
                snackbar.show({
                  ...props,
                  variant: 'negative',
                  title: 'This is another snackbar',
                })
              }
            >
              Show another Snackbar
            </Button>
            <Button variant="secondary" variantColor="shade" onClick={() => snackbar.close()}>
              Close Snackbar
            </Button>
          </View>
        </Flex>
      </View>
    </Flex>
  );
};

storiesOf('Snackbar', module)
  .addParameters({
    component: Snackbar,
  })
  .add('default', () => (
    <Flex flex={1}>
      <View>
        <SnackbarProvider>
          <SnackDemo
            variant={select('Variant', variantOptions, undefined)}
            title={text('Title', 'Snackbar text here')}
            maxLines={number('maxLines', undefined)}
            actionText={text('Action Text', 'Retry')}
            onAction={() => {}}
            onClose={() => {}}
            showCloseButton={boolean('showCloseButton', true)}
            autoHide={boolean('autoHide', true)}
            icon={select('icon', iconOptions, 'info')}
            position={{ bottom: 1 }}
          />
        </SnackbarProvider>
      </View>
    </Flex>
  ));
