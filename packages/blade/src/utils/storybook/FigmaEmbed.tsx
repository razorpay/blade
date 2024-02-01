import React from 'react';
import { Text } from '~components/Typography';

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

      <Text size="small" color="surface.text.gray.muted">
        Note: Figma designs are only accessible to Razorpay Employees
      </Text>
      <br />
      <br />
    </>
  );
}

export default FigmaEmbed;
