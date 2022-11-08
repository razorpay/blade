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

type StoryPageWrapperTypes = {
  figmaURL: {
    paymentTheme: string;
    bankingTheme: string;
  };
  componentDescription: string;
  componentName: string;
  children: React.ReactNode;
  note?: string;
};

const StoryPageWrapper = (props: StoryPageWrapperTypes): React.ReactElement => {
  const figmaURL = useMakeFigmaURL([
    {
      themeTokenName: 'paymentTheme',
      lightModeURL: props.figmaURL.paymentTheme,
      darkModeURL: props.figmaURL.paymentTheme,
    },
    {
      themeTokenName: 'bankingTheme',
      lightModeURL: props.figmaURL.bankingTheme,
      darkModeURL: props.figmaURL.bankingTheme,
    },
  ]);

  return (
    <>
      <Title />
      <Subtitle>{props.componentDescription}</Subtitle>
      {props.note ? <Description markdown={`> **Note** <br/>${props.note}`} /> : null}
      <FigmaEmbed src={figmaURL} title={`${props.componentName} Figma Designs`} />
      <br />
      <br />
      {props.children}
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
