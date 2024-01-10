import React from 'react';
import dedent from 'dedent';
import { ScrollView } from 'react-native';
import type { SandboxProps } from '../types';
import { BaseText } from '~components/Typography/BaseText';
import { Link } from '~components/Link';

// In React Native, the codesandbox doesn't work. So replacing it with normal text display for native
function Sandbox({ children, uri }: SandboxProps): JSX.Element {
  return (
    <ScrollView>
      {uri ? <Link href={uri}>Open Story in Web</Link> : null}
      <BaseText marginTop="spacing.5" fontFamily="code">
        {dedent(children)}
      </BaseText>
    </ScrollView>
  );
}

export { Sandbox };
