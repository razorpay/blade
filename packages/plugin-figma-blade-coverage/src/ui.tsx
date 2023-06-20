import { Button, Container, render, VerticalSpace } from '@create-figma-plugin/ui';
import { emit } from '@create-figma-plugin/utilities';
import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';

import styles from './styles.css';
import type { InsertCodeHandler } from './types';

const Plugin = (): JSX.Element => {
  const handleInsertCodeButtonClick = React.useCallback(() => {
    emit<InsertCodeHandler>('INSERT_CODE', 'abc');
  }, []);
  return (
    <div>
      <Container space="medium">
        <VerticalSpace space="small" />
        Hello, Word!
        <VerticalSpace space="large" />
        <Button fullWidth onClick={handleInsertCodeButtonClick}>
          Insert Code
        </Button>
        <VerticalSpace space="small" />
      </Container>
    </div>
  );
};

export default render(Plugin);
