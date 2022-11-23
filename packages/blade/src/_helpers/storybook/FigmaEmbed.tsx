import { Description } from '@storybook/addon-docs';
import dedent from 'dedent';

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
        markdown={dedent`
          > **Note**
          > 
          > Currently the designs are only accessible to Razorpay Employees.
          >
          > For Razorpay Employees,<br/>
          > Figma Embed may not work with adblockers 😿. You can [View Design on Figma](${props.src}) or pause adblockers for this domain.
        `}
      />
      <br />
      <br />
    </>
  );
}

export default FigmaEmbed;
