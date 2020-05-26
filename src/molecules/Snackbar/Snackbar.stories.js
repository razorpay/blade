import React from 'react';
import { storiesOf } from '@storybook/react';
import { select, text, number, boolean } from '@storybook/addon-knobs';
import Flex from '../../atoms/Flex';
import View from '../../atoms/View';
import Button from '../../atoms/Button';
import Snackbar from './Snackbar';
import useSnackbar from './useSnackbar';
import SnackbarProvider from './SnackbarProvider';

const variantOptions = {
  positive: 'positive',
  negative: 'negative',
  warning: 'warning',
  neutral: 'neutral',
};

const SnackDemo = (props) => {
  const snackbar = useSnackbar();

  return (
    <Flex alignSelf="center">
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
    <SnackWrapper
      variant={select('Variant', variantOptions, undefined)}
      text={text('Text', 'Snackbar text here')}
      maxLines={number('maxLines', undefined)}
      actionText={text('Action Text', 'Retry')}
      onAction={() => {}}
      onDismiss={() => {}}
      showDismissButton={boolean('showDismissButton', true)}
      autoDismiss={boolean('autoDismiss', false)}
    />
  ));
//   .add('default', () => (
//     <Snackbar
//       variant={select('Variant', variantOptions, undefined)}
//       text={text('Text', 'Snackbar text here')}
//       maxLines={number('maxLines', undefined)}
//       actionText={text('Action Text', 'Retry')}
//       onAction={() => {}}
//       onDismiss={() => {}}
//       showDismissButton={true}
//     />
//   ));
