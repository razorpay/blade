declare const parameters: {
    viewMode: string;
    options: {
        showPanel: boolean;
    };
    previewTabs: {
        'storybook/docs/panel': {
            hidden: boolean;
        };
    };
    chromatic: {
        disableSnapshot: boolean;
    };
};
export default parameters;
