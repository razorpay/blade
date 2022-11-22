function FigmaEmbed(props: { src: string; title: string }): JSX.Element {
  return (
    <iframe
      title={props.title}
      style={{ border: 'none' }}
      width="800"
      height="450"
      src={`https://www.figma.com/embed?embed_host=share&url=${props.src}`}
      allowFullScreen
    />
  );
}

export default FigmaEmbed;
