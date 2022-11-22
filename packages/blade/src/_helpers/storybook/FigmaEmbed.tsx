import { Description } from '@storybook/addon-docs';

function FigmaEmbed(props: { src: string; title: string }): JSX.Element {
  return (
    <>
      <iframe
        title={props.title}
        style={{ border: 'none' }}
        width="800"
        height="450"
        src={`https://www.figma.com/embed?embed_host=share&url=${props.src}`}
        allowFullScreen
      />
      <Description
        markdown={`> **Note** <br/>If you're using adblockers, the Figma Embed may not work. <br/>You can pause adblocker for this site and allow cross site cookies which might be blocked by your browser. Alternatively [check out the designs on Figma](${props.src}) directly`}
      />
      <br />
      <br />
    </>
  );
}

export default FigmaEmbed;
