/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Title } from '@storybook/addon-docs';
import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import type { LinkProps } from 'react-router-dom';
import { useLocation, Link as RouterLink, matchPath, Route } from 'react-router-dom';
import StoryRouter from 'storybook-react-router';
import type { BreadcrumbItemProps, BreadcrumbProps } from './types';
import { Breadcrumb } from './Breadcrumb';
import { BreadcrumbItem } from './BreadcrumbItem';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import { Box } from '~components/Box';
import { HomeIcon } from '~components/Icons';
import { Code, Text } from '~components/Typography';
import { Card, CardBody, CardHeader, CardHeaderLeading } from '~components/Card';
import { Link } from '~components/Link';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Breadcrumb"
      componentDescription="Toast is a feedback element to display temporary short messages in the interface"
      figmaURL="https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=75839-1125191&mode=design&t=SLxhqgKm27oCjSYV-4"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import { ToastContainer, useToast } from '@razorpay/blade/components';

        function App(): React.ReactElement {
          const toast = useToast();

          // Integrating Blade Toast in your App
          // 1. Render the ToastContainer component at the root of your app
          // 2. Utilize the methods exposed via useToast hook to show/dismiss toasts
          return (
            <Box>
              <ToastContainer />
              <Button 
                onClick={() => {
                  toast.show({ content: 'Payment successful', color: 'positive' })
                }}
              >
                Show Toast
              </Button>
            </Box>
          );
        }
        
        export default App;        
      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
    onDismiss: { action: 'Dismissed' },
  },
  args: {
    size: 'medium',
    color: 'primary',
    showLastSeparator: false,
  },
  // eslint-disable-next-line babel/new-cap
  decorators: [StoryRouter(undefined, { initialEntries: ['/home'] })] as unknown,
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<BreadcrumbProps>;

const BasicToastTemplate: StoryFn<BreadcrumbProps> = (props) => {
  return (
    <Box
      padding="spacing.4"
      backgroundColor={props.color === 'white' ? 'surface.background.cloud.intense' : undefined}
    >
      <Breadcrumb {...props}>
        <BreadcrumbItem accessibilityLabel="Home" icon={HomeIcon} href="/home" />
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage href="/settlements">
          Settlements
        </BreadcrumbItem>
      </Breadcrumb>
    </Box>
  );
};

BasicToastTemplate.storyName = 'Basic';
export const Basic = BasicToastTemplate.bind({});

const BreadcrumbSizes: StoryFn<BreadcrumbProps> = () => {
  return (
    <Box display="flex" gap="spacing.5" flexDirection="column">
      <Breadcrumb size="small">
        <BreadcrumbItem accessibilityLabel="Home" icon={HomeIcon} href="/home" />
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage href="/settlements">
          Settlements
        </BreadcrumbItem>
      </Breadcrumb>
      <Breadcrumb size="medium">
        <BreadcrumbItem icon={HomeIcon} href="/home" />
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage href="/settlements">
          Settlements
        </BreadcrumbItem>
      </Breadcrumb>
      <Breadcrumb size="large">
        <BreadcrumbItem icon={HomeIcon} href="/home" />
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage href="/settlements">
          Settlements
        </BreadcrumbItem>
      </Breadcrumb>
    </Box>
  );
};

BreadcrumbSizes.storyName = 'Sizes';
export const Sizes = BreadcrumbSizes.bind({});

const BreadcrumbColors: StoryFn<BreadcrumbProps> = () => {
  return (
    <Box display="flex" gap="spacing.5" flexDirection="column">
      <Box padding="spacing.4">
        <Breadcrumb size="medium" color="primary">
          <BreadcrumbItem accessibilityLabel="Home" icon={HomeIcon} href="/home" />
          <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage href="/settlements">
            Settlements
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>
      <Box padding="spacing.4">
        <Breadcrumb size="medium" color="neutral">
          <BreadcrumbItem icon={HomeIcon} href="/home" />
          <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage href="/settlements">
            Settlements
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>
      <Box padding="spacing.4" backgroundColor="surface.background.cloud.intense">
        <Breadcrumb size="medium" color="white">
          <BreadcrumbItem icon={HomeIcon} href="/home" />
          <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage href="/settlements">
            Settlements
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>
    </Box>
  );
};

BreadcrumbColors.storyName = 'Colors';
export const Colors = BreadcrumbColors.bind({});

const urls = {
  home: '/home',
  dashboard: '/dashboard',
  settlements: '/settlements',
  payment: '/payment-gateway',
};

type BreadcrumbLinkProps = Omit<LinkProps, 'children'> &
  BreadcrumbItemProps & { navigate: () => void };

const BreadcrumbLink = ({ onClick, ...props }: BreadcrumbLinkProps): React.ReactElement => {
  const location = useLocation();

  const isCurrentPage =
    matchPath(location.pathname, {
      path: props.href,
      exact: true,
    }) !== null;

  return (
    <BreadcrumbItem
      isCurrentPage={isCurrentPage}
      onClick={(e) => {
        onClick?.(e as never);
        e.preventDefault();
        props.navigate();
      }}
      {...props}
    />
  );
};

const BreadcrumbNavLink = (
  props: Omit<BreadcrumbItemProps, 'href'> & LinkProps,
): React.ReactElement => {
  return <RouterLink component={BreadcrumbLink} {...props} />;
};

const Page1 = (): React.ReactElement => {
  return (
    <Breadcrumb size="medium" color="primary">
      <BreadcrumbNavLink icon={HomeIcon} to={urls.home}>
        Home
      </BreadcrumbNavLink>
    </Breadcrumb>
  );
};

const Page2 = (): React.ReactElement => {
  return (
    <Breadcrumb size="medium" color="primary">
      <BreadcrumbNavLink icon={HomeIcon} to={urls.home}>
        Home
      </BreadcrumbNavLink>
      <BreadcrumbNavLink icon={HomeIcon} to={urls.dashboard}>
        Dashboard
      </BreadcrumbNavLink>
    </Breadcrumb>
  );
};

const Page3 = (): React.ReactElement => {
  return (
    <Breadcrumb size="medium" color="primary">
      <BreadcrumbNavLink icon={HomeIcon} to={urls.home}>
        Home
      </BreadcrumbNavLink>
      <BreadcrumbNavLink icon={HomeIcon} to={urls.dashboard}>
        Dashboard
      </BreadcrumbNavLink>
      <BreadcrumbNavLink icon={HomeIcon} to={urls.settlements}>
        Settlements
      </BreadcrumbNavLink>
    </Breadcrumb>
  );
};

const Page4 = (): React.ReactElement => {
  return (
    <Breadcrumb size="medium" color="primary">
      <BreadcrumbNavLink icon={HomeIcon} to={urls.home}>
        Home
      </BreadcrumbNavLink>
      <BreadcrumbNavLink icon={HomeIcon} to={urls.dashboard}>
        Dashboard
      </BreadcrumbNavLink>
      <BreadcrumbNavLink icon={HomeIcon} to={urls.settlements}>
        Settlements
      </BreadcrumbNavLink>
      <BreadcrumbNavLink icon={HomeIcon} to={urls.payment}>
        Payment Gateway
      </BreadcrumbNavLink>
    </Breadcrumb>
  );
};

const CommonPage = (): React.ReactElement => {
  const location = useLocation();
  return (
    <Card marginTop="spacing.5">
      <CardHeader>
        <CardHeaderLeading title={`Welcome to ${location.pathname}`} />
      </CardHeader>
      <CardBody>
        <Box marginBottom="spacing.8">
          <Text>
            You can use <Code size="medium">Breadcrumbs</Code> with{' '}
            <Code size="medium">react-router</Code> to create a breadcrumb trail for your app.
          </Text>
          <Text weight="semibold" as="span" marginTop="spacing.4">
            Open this <Link href="#">Codesandbox link</Link> to see the source code.
          </Text>
        </Box>

        <Text marginBottom="spacing.3">Trigger URL Change:</Text>
        <Box display="flex" flexDirection="column" gap="spacing.2">
          <RouterLink to={urls.home}>Home</RouterLink>
          <RouterLink to={urls.dashboard}>Dashboard</RouterLink>
          <RouterLink to={urls.settlements}>Settlements</RouterLink>
          <RouterLink to={urls.payment}>Payment Gateway</RouterLink>
        </Box>
      </CardBody>
    </Card>
  );
};

const RouterExample = (): React.ReactElement => {
  return (
    <Box>
      <Route path={urls.home} component={Page1} />
      <Route path={urls.dashboard} component={Page2} />
      <Route path={urls.settlements} component={Page3} />
      <Route path={urls.payment} component={Page4} />
      <Route path="/" component={CommonPage} />
    </Box>
  );
};

const ReactRouterUsageTemplate: StoryFn<BreadcrumbProps> = () => {
  return <RouterExample />;
};

ReactRouterUsageTemplate.storyName = 'ReactRouterUsage';
export const ReactRouterUsage = ReactRouterUsageTemplate.bind({});
