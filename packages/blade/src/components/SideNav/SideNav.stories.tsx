import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import StoryRouter from 'storybook-react-router';
import { NavLink, Route, Switch } from 'react-router-dom';
import { SideNav, SideNavLink } from './SideNav';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Box } from '~components/Box';
import { ArrowUpRightIcon, HomeIcon } from '~components/Icons';
import { Heading } from '~components/Typography';

export default {
  title: 'Components/SideNav',
  component: SideNav,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  // eslint-disable-next-line babel/new-cap
  decorators: [StoryRouter(undefined, { initialEntries: ['/app'] })] as unknown,
} as Meta<typeof SideNav>;

const Page = ({ match }: { match: any }): React.ReactElement => (
  <Box>
    <Heading>ID: {JSON.stringify(match)}</Heading>
  </Box>
);

const SideNavTemplate: StoryFn<typeof SideNav> = () => {
  return (
    <Box>
      <SideNav routerLink={NavLink}>
        <SideNavLink icon={HomeIcon} title="Home" href="/app" />
        <SideNavLink icon={ArrowUpRightIcon} title="Payouts" href="/app/payouts" />
        <SideNavLink icon={ArrowUpRightIcon} title="Nice" href="/nice" />
      </SideNav>

      <Box marginLeft="300px">
        <Switch>
          <Route path="/app" component={Page} />
          <Route path="/app/payouts" component={Page} />
          <Route path="/nice" component={Page} />
        </Switch>
      </Box>
    </Box>
  );
};

export const Default = SideNavTemplate.bind({});
