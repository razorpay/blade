import dedent from 'dedent';
import {
  ArgsTable,
  Primary,
  PRIMARY_STORY,
  Stories,
  Subtitle,
  Title,
  Description,
} from '@storybook/addon-docs';
import { Highlight } from '@storybook/design-system';
import useMakeFigmaURL from './useMakeFigmaURL';
import FigmaEmbed from './FigmaEmbed';

type StoryPageWrapperTypes = {
  figmaURL?: {
    paymentTheme: string;
    bankingTheme: string;
  };
  componentDescription: string;
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
      {props.children}
      {props.imports === '' ? null : (
        <>
          <Title>Imports</Title>
          <Highlight language="tsx">
            {props.imports
              ? dedent(props.imports)
              : `import { ${props.componentName} } from '@razorpay/blade/components';\nimport type { ${props.componentName}Props } from '@razorpay/blade/components';`}
          </Highlight>
          <br />
          <br />
        </>
      )}

      <Title>Example</Title>
      <Subtitle>
        {`This is the default ${props.componentName}. You can change the properties using the controls below.`}
      </Subtitle>
      <Primary />
      <Title>Properties</Title>
      <ArgsTable story={PRIMARY_STORY} />
      <Stories />
    </>
  );
};

export default StoryPageWrapper;
