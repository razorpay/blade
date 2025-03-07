import type { StoryFn, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import { Button } from '~components/Button';
import { Link } from '~components/Link';
import { SkipNavContent, SkipNavLink } from '~components/SkipNav';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="The SkipNav component lets users skip the navigation and jump to the main content of the page. Useful when you have navbars at the top and the user wants to jump directly to the main content."
      componentName="SkipNav"
      imports=""
      apiDecisionLink={null}
    >
      <Title>Usage</Title>
      <Sandbox editorHeight={400}>
        {`
          import { 
            SkipNavLink, 
            SkipNavContent, 
            Text, 
            Link,
            Code,
            Box 
          } from '@razorpay/blade/components';

          function App() {
            return (
              <Box>
                <Text>Click somewhere on the text here to focus on this window and press <Code>TAB</Code> key to see it in action</Text>
                <SkipNavLink>Skip to content</SkipNavLink>
                <nav style={{ marginBottom: '800px' }}>
                  <ul>
                    <li><Link href="#">Nav link 1</Link></li>
                    <li><Link href="#">Nav link 2</Link></li>
                    <li><Link href="#">Nav link 3</Link></li>
                  </ul>
                </nav>
                <main>
                  <SkipNavContent />
                  <Text>Main Content of the Page</Text>
                </main>
              </Box>
            )
          }

          export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const SkipNavStoryMeta: Meta = {
  title: 'Components/Accessibility/SkipNav',
  component: SkipNavLink,
  args: {},
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: () => <Page />,
    },
  },
};

const SkipNavTemplate: StoryFn<typeof SkipNavLink> = () => {
  return (
    <>
      <SkipNavLink>Skip to content</SkipNavLink>
      <SkipNavLink id="second">Skip to second content</SkipNavLink>
      <nav style={{ display: 'flex' }}>
        <ul style={{ marginLeft: 'auto', display: 'flex', listStyle: 'none', gap: '10px' }}>
          <li>
            <Link href="#1">Home</Link>
          </li>
          <li>
            <Link href="#2">Pricing</Link>
          </li>
          <li>
            <Link href="#3">Login</Link>
          </li>
          <li>
            <Link href="#4">SignUp</Link>
          </li>
        </ul>
      </nav>
      <BaseBox>
        <SkipNavContent />
        <Text>Main content of the page</Text>
        <BaseBox marginTop="spacing.2" />
        <BaseBox gap="spacing.2" display="flex">
          <Button size="small">Button 1</Button>
          <Button size="small">Button 2</Button>
        </BaseBox>
        <SkipNavContent id="second" />
        <BaseBox marginTop="spacing.2" />
        <Text>Second Main content of the page</Text>
        <BaseBox marginTop="spacing.2" />
        <BaseBox gap="spacing.2" display="flex">
          <Button size="small">Button 3</Button>
          <Button size="small">Button 4</Button>
        </BaseBox>
      </BaseBox>
    </>
  );
};

export default SkipNavStoryMeta;
export const SkipNavExample = SkipNavTemplate.bind({});
