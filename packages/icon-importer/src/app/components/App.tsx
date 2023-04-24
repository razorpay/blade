import React from 'react';
import '../styles/ui.css';
// eslint-disable-next-line import/extensions
import 'figma-plugin-ds/dist/figma-plugin-ds.css';

function App() {
  const [svgString, setSvgString] = React.useState('');
  // const inputRef = React.useRef<HTMLInputElement>(null);

  // const onCancel = () => {
  //   parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  // };

  React.useEffect(() => {
    onmessage = (event) => {
      const data = event.data.pluginMessage;
      if (data.type === 'svg-data') {
        const svg = data.data;
        // textarea.svg = svg;
        // let d = transform(svg);
        setSvgString(JSON.stringify(svg, null, 2));
      }
    };
  }, []);

  return (
    <main>
      <button
        onClick={() => {
          parent.postMessage({ pluginMessage: { type: 'create-rectangles' } }, '*');
        }}
      >
        Export
      </button>

      <textarea style={{ width: '100%', height: 200 }} value={svgString} />
    </main>
  );
}

export default App;
