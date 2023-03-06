import {
  ArgsTable,
  Primary,
  PRIMARY_STORY,
  Stories,
  Subtitle,
  Title,
  Description,
} from '@storybook/addon-docs';
import useMakeFigmaURL from './useMakeFigmaURL';
import FigmaEmbed from './FigmaEmbed';
import { SandboxHighlighter } from './Sandbox';
import BaseBox from '~components/Box/BaseBox';
import { Alert } from '~components/Alert';
import { BladeProvider } from '~components/BladeProvider';
import { paymentTheme } from '~tokens/theme';
import { Box } from '~components/Box';

type StoryPageWrapperTypes = {
  figmaURL?: {
    paymentTheme: string;
    bankingTheme: string;
  };
  componentDescription: string;
  propsDescription?: string;
  componentName: string;
  children?: React.ReactNode;
  note?: string;
  /**
   * Use this to override default imports
   */
  imports?: string;
};

const StoryPageWrapper = (props: StoryPageWrapperTypes): React.ReactElement => {
  const figmaURL = useMakeFigmaURL([
    {
      themeTokenName: 'paymentTheme',
      lightModeURL: props.figmaURL?.paymentTheme,
      darkModeURL: props.figmaURL?.paymentTheme,
    },
    {
      themeTokenName: 'bankingTheme',
      lightModeURL: props.figmaURL?.bankingTheme,
      darkModeURL: props.figmaURL?.bankingTheme,
    },
  ]);

  return (
    <>
      <Title>{props.componentName}</Title>
      <Subtitle>{props.componentDescription}</Subtitle>
      {props.note ? <Description markdown={`> **Note** <br/>${props.note}`} /> : null}
      {figmaURL !== '#' ? (
        <FigmaEmbed src={figmaURL} title={`${props.componentName} Figma Designs`} />
      ) : null}
      <BladeProvider themeTokens={paymentTheme}>{props.children}</BladeProvider>
      {props.imports === '' ? null : (
        <>
          <Title>Imports</Title>
          <SandboxHighlighter showLineNumbers={false} showTabs={false}>
            {props.imports
              ? props.imports
              : `import { ${props.componentName} } from '@razorpay/blade/components';\nimport type { ${props.componentName}Props } from '@razorpay/blade/components';`}
          </SandboxHighlighter>
          <br />
          <br />
        </>
      )}

      <Title>Example</Title>
      <Subtitle>
        {`This is the default ${props.componentName}. You can change the properties using the controls below.`}
      </Subtitle>
      <Primary />
      <BaseBox id="properties-ref">
        <Title>Properties</Title>
        {props.propsDescription ? (
          // adding box with surface background so that when theme of storybook is changed, the alert doesn't become invisible
          <Box backgroundColor="surface.background.level3.lowContrast">
            <Alert
              isFullWidth
              marginTop="spacing.5"
              isDismissible={false}
              description={props.propsDescription}
            />
          </Box>
        ) : null}
      </BaseBox>
      <ArgsTable story={PRIMARY_STORY} />
      <Stories />
    </>
  );
};

export default StoryPageWrapper;
