import { Description } from '@storybook/addon-docs';
import dedent from 'dedent';
import React from 'react';

function FigmaEmbed(props: { src: string; title: string }): JSX.Element {
  return (
    <>
      <iframe
        title={props.title}
        style={{ border: 'none' }}
        width="800"
        height="300"
        src={`https://www.figma.com/embed?embed_host=share&url=${props.src}`}
        allowFullScreen
      />
      <Description
        markdown={dedent`
        <small>
          <details>
            <summary style="cursor: pointer">Figma not loading?</summary>

            > Currently the designs are only accessible to Razorpay Employees.
            >
            > For Razorpay Employees,<br/>
            > Figma Embed may not work with adblockers 😿. You can [View Design on Figma](${props.src}) or pause adblockers for this domain.
        
          </details>
        </small>
        `}
      />
      <br />
      <br />
    </>
  );
}

export default FigmaEmbed;
