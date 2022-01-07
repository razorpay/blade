import React from 'react';
import { storiesOf } from '@storybook/react';
import { select, text, number, boolean } from '@storybook/addon-knobs';
import Flex from '../../atoms/Flex';
import View from '../../atoms/View';
import Button from '../../atoms/Button';
import { useSnackbar, SnackbarProvider } from '../Snackbar';
import { Info } from '../../icons';

const variantOptions = {
  positive: 'positive',
  negative: 'negative',
  warning: 'warning',
  neutral: 'neutral',
};

const SnackbarDemo = (props) => {
  const snackbar = useSnackbar();

  return (
    <Flex flex={1}>
      <View>
        <Flex justifyContent="space-around" flexDirection="column" flex={0.5}>
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
    component: SnackbarProvider,
  })
  .add('default', () => (
    <Flex flex={1}>
      <View>
        <SnackbarProvider>
          <SnackbarDemo
            variant={select('Variant', variantOptions, undefined)}
            title={text('Title', 'Snackbar text here')}
            maxLines={number('maxLines', undefined)}
            action={{
              label: text('Action Label', 'Retry'),
              onClick: () => {},
            }}
            onClose={() => {}}
            autoHide={boolean('autoHide', true)}
            icon={Info}
            position={{
              bottom: 1,
            }}
          />
        </SnackbarProvider>
      </View>
    </Flex>
  ));
