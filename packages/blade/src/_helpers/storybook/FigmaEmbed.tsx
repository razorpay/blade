function FigmaEmbed({ src }: { src: string }): JSX.Element {
  return (
    <>
      <iframe
        title="Badge Figma"
        style={{ border: 'none' }}
        width="800"
        height="450"
        src={`https://www.figma.com/embed?embed_host=share&url=${src}`}
        allowFullScreen
      />
      <br />
      <br />
    </>
  );
}

export default FigmaEmbed;
