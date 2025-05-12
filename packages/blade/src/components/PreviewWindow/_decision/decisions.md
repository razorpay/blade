# Preview Window Decisions

A **Preview Window** is a component used to display a visual preview of an image or any other UI component.

<img src="./preview.png" width="380" alt="preview-thumbnail" />
<img src="./breakdown.svg" width="380" alt="breakdown" />

---

- [Design](#design)
- [Preview Window Component](#preview-window-component)
  - [Preview Window API](#preview-window-api)
  - [Alternative API](#alternative-api)
- [Open Questions](#open-questions)

---

## Design

[Figma Link](https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=103462-52670&p=f&t=qC2NU4R56lEGsGFB-0)

---

## Preview Window Component

The `PreviewWindow` component is the primary component used to render a live preview of content with optional interactivity and controls.

---

## Preview Window API

| Prop             | Type                                                   | Default | Required | Description                                                                 |
|------------------|--------------------------------------------------------|---------|----------|-----------------------------------------------------------------------------|
| `children`       | `React.Element`                                        | —       | Yes      | The component to be rendered inside the preview window.                     |
| `onFullScreen`   | `() => void`                                           | —       | No       | Callback invoked when the fullscreen button is clicked.                     |
| `isDragAndZoomEnabled`  | `boolean`                                              | —       | No       | Whether Drag and Zoom functionality is enabled.                                      |
| `onZoomChange`   | `({ zoom }) => void`                            | —       | No       | Callback invoked when the zoom level changes.                               |
| `zoom`           | `number`                                               | `50`    | Yes      | A number between 1 and 100 that sets the zoom level.                        |
| `onDragChange`   | `(position: { x: number; y: number }) => void`         | —       | No       | Callback invoked when the drag position changes.                            |
| `zoomScaleStep`       | `number`                                               | `10`    | No       | A number between 5 and 30 that determines the zoom step per click.         |

```tsx
type PreviewWindowProps = {
  children: React.ReactElement;
  onFullScreen?: () => void;
  isDragAndZoomEnabled?: boolean;
  zoom: number;
  onZoomChange?: (newZoom: number) => void;
  onDragChange?: (position: { x: number; y: number }) => void;
  defaultZoom?: number;
  zoomScaleStep?: number;
};
```


In addition, we will have three layout components:
 - PreviewHeader
 - PreviewBody
 - PreviewFooter


```tsx
type PreviewHeader = {
  title?: string;
  trailing?: React.ReactElement;
};

type PreviewBody = {
  children: React.ReactElement;
};

type PreviewFooter = {
  trailing?: React.ReactElement;
  showZoomPercentage?: boolean;
};
```

Example Usage - 

```tsx
<PreviewWindow>
  <PreviewHeader title="Preview" trailing={<DownloadButton />} />
  <PreviewBody>
  <img src="/preview.jpg" alt="Example Preview" />
  </PreviewBody>
  <PreviewFooter trailing={<DeviceToggle />} />
</PreviewWindow>

// Without zoom controls
<PreviewWindow>
  <PreviewBody>
  <ComponentToPreview />
  </PreviewBody>
</PreviewWindow>

// Without Drag & Zoom
<PreviewWindow isDragAndZoomEnabled={false}>
  <StaticComponent />
</PreviewWindow>
```

## Alternative API
- For PreviewWindow component
    ```tsx
    // Using prop-driven content instead of children
    <PreviewWindow content={<ImageComponent />} headingText="Preview" />
    ```
- For `additionalControls `

    we can provide a wrapper components  like `<Header/>` and  `<Footer/>` and consumers can pass their custom controls , we will add zoom reset automatically.
    ```tsx
    <PreviewPanel>
    <Header>
     <Controls/>
    </Header>
    <Footer>
         <Controls/>
    </Footer>
    ```

    we can also have a hook `usePreviewWindow` which will expose methods like `onZoomIncrementButtonClick` ,  `onZoomDecrementButtonClick` , `onFullScreenClick` , `onResetZoomResetClick` and consumers can use it like 
    ``` tsx
    <PreviewPanel>
      <Header>
        <FullScreenButton onClick={onFullScreenClick} />
        <CustomComponent/>
      </Header>
      <PreviewFile/>
      <Footer>
       <ZoomIncrementButton onClick={onZoomIncrementButtonClick} />
       <ZoomDecrementButton onClick={onZoomDecrementButtonClick} />
      </Footer>
    </PreviewPanel>
    ```

  Relevant API considerations and decisions taken during the discussion - 

     - During the API discussion, we decided to use third-party libraries for implementing pinch, pan, and zoom functionality. Since we might miss out on edge cases, we chose to use `react-zoom-pan-pinch` after exploring libraries like `sasza/react-panzoom`, `react-quick-pinch-zoom`, and `react-map-interaction`.

    - Since most consumers may need to show previews of PDFs, documents, and other file formats, we will provide relevant examples of how to do that using the `<PreviewWindow />` component. PreviewWindow is a wrapper that provides interactions like zoom, pan, and pinch. For rendering files like PDFs, consumers will need to use custom renderers.

    - [Preview Panel Discussion Doc](https://docs.google.com/document/d/1jBir51pHmvYxFTL9Z4Tt0p2oo2oAVp4ttcrw938vgl4/edit?usp=sharing)
    - [Further Discussion – Slack Thread](https://razorpay.slack.com/archives/C01H13RTF8V/p1746701228400979)

## Open Questions

- Should we change it's name to PreviewPanel ?
