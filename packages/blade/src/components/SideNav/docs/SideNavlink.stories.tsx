/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import type { SideNavLinkProps } from '../types';
import { SideNav, SideNavBody, SideNavLink } from '../index';
import { Box } from '~components/Box';
import iconMap from '~components/Icons/iconMap';
import { HomeIcon, PlusIcon } from '~components/Icons';
import { Badge } from '~components/Badge';
import { Button } from '~components/Button';

const titleSuffixMapping = {
  '<Badge color="positive" size="small">NEW</Badge>': (
    <Badge color="positive" size="small">
      NEW
    </Badge>
  ),
};

const trailingMapping = {
  '<Button icon={PlusIcon} variant="tertiary" size="xsmall" />': (
    <Button icon={PlusIcon} variant="tertiary" size="xsmall" />
  ),
};

export default {
  title: 'Components/SideNav/SideNavLink Playground',
  component: SideNavLink,
  argTypes: {
    icon: {
      name: 'icon',
      type: 'select',
      options: Object.keys(iconMap),
      mapping: iconMap,
    } as unknown,
    titleSuffix: {
      name: 'titleSuffix',
      type: 'select',
      options: Object.keys(titleSuffixMapping),
      mapping: titleSuffixMapping,
    } as unknown,
    trailing: {
      name: 'trailing',
      type: 'select',
      options: Object.keys(trailingMapping),
      mapping: trailingMapping,
    } as unknown,
  },
  parameters: {},
} as Meta<SideNavLinkProps>;

const SideNavLinkTemplate: StoryFn<typeof SideNavLink> = (args) => {
  return (
    <Box>
      <SideNav position="absolute" top="spacing.0">
        <SideNavBody>
          <SideNavLink {...args} />
        </SideNavBody>
      </SideNav>
    </Box>
  );
};

export const SideNavLinkPlayground = SideNavLinkTemplate.bind({});
SideNavLinkPlayground.args = {
  title: 'Home',
  icon: HomeIcon,
  tooltip: { content: 'Open Dashboard Home (Cmd + H)' },
};
SideNavLinkPlayground.storyName = 'SideNavLink Playground';
