import React from 'react';
import { storiesOf } from '@storybook/react';
import { select, text, number, boolean } from '@storybook/addon-knobs';
import Flex from '../../atoms/Flex';
import View from '../../atoms/View';
import Button from '../../atoms/Button';
import { getIconNames } from '../../_helpers/icon';
import Snackbar from './Snackbar';
import useSnackbar from './useSnackbar';
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
    <Flex justifyContent="space-between" flexDirection="row" flex={1}>
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
        <Button onClick={() => snackbar.dismiss()}>Dismiss Snackbar</Button>
      </View>
    </Flex>
  );
};

const SnackWrapper = (props) => {
  return (
    <SnackbarProvider>
      <Flex flex={1}>
        <View>
          <SnackDemo {...props} />
        </View>
      </Flex>
    </SnackbarProvider>
  );
};

storiesOf('Snackbar', module)
  .addParameters({
    component: Snackbar,
  })
  .add('default', () => (
    <Flex flex={1}>
      <View>
        <SnackWrapper
          variant={select('Variant', variantOptions, undefined)}
          text={text('Text', 'Snackbar text here')}
          maxLines={number('maxLines', undefined)}
          actionText={text('Action Text', 'Retry')}
          onAction={() => {}}
          onDismiss={() => {}}
          showDismissButton={boolean('showDismissButton', true)}
          autoDismiss={boolean('autoDismiss', true)}
          iconName={select('iconName', iconOptions, 'info')}
          position={{ bottom: 1 }}
        />
      </View>
    </Flex>
  ));
