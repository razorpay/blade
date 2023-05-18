import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import type { SwitchProps } from './types';
import { Switch as SwitchComponent } from './Switch';
import BaseBox from '~components/Box/BaseBox';
import { isReactNative } from '~utils';

export default {
  title: 'Components/Switch/Switch',
  component: SwitchComponent,
  args: {
    defaultChecked: undefined,
    isChecked: undefined,
    isDisabled: undefined,
    name: undefined,
    onChange: undefined,
    value: undefined,
    size: 'medium',
  },
} as Meta<SwitchProps>;

const SwitchTemplate: ComponentStory<typeof SwitchComponent> = ({ ...args }) => {
  return (
    <BaseBox>
      <SwitchComponent {...args} size="medium" accessibilityLabel="Toggle dark mode" />
      <SwitchComponent {...args} size="small" accessibilityLabel="Toggle dark mode" />
      {isReactNative() ? null : (
        <BaseBox style={{ display: 'flex', alignItems: 'center' }}>
          <label className="Label" htmlFor="airplane-mode" style={{ paddingRight: 15 }}>
            Airplane mode
          </label>
          <SwitchComponent id="airplane-mode" size="small" />
        </BaseBox>
      )}
    </BaseBox>
  );
};

export const Default = SwitchTemplate.bind({});
Default.storyName = 'Default';
