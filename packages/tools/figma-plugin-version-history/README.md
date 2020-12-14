# Vue Plugin Template for Figma

## Features:

- Vue
- Typescript
- [figma-plugin-ds](https://github.com/thomas-lowry/figma-plugin-ds) integration
- Message handler helper functions to simplify communication between the main code and the UI code

## How to use?

1. Install dependencies with `npm i`.
2. Run `npm run dev` and a folder named `dist` will be created.
3. In the Figma desktop app, click on **Create new plugin** / **Link existing plugin** and point it to the `manifest.json` in this project.
4. Now you can edit the main Figma code from `src/code.ts` and the UI code from `src/ui.vue`. Hitting save will auto-reload the build so you can see your changes right away.
5. When you're ready to publish the plugin, run `npm run build` to create a production build.

## Message handlers

To communicate between the main code and the UI code, you can use the `dispatch` and `handleEvent` functions to send and listen to messages between the two environments.

Sending a message from the main code to UI code:

```
dispatch('eventName', data)
```

Handling messages from the UI code to the main code:

```
handleEvent('eventName', data => {
    // Do something with the data
})
```

Note that data is optional so you could simply send a message by `dispatch('eventName')`.

In the vue UI code, `dispatch` can be called anywhere, but `handleEvent` functions should be called in `mounted()` so they would only be called first and only once.

This project template shows an example of a UI button sending a message to the main code to create a rectangle node. The main code then sends back the created node ID to be displayed in the UI.
