const parameters = {
  viewMode: 'story',
  options: {
    showPanel: false,
  },
  previewTabs: {
    'storybook/docs/panel': {
      hidden: true,
    },
  },
  // Running visual tests of recipes can give false negatives because this is not exactly a story
  // E.g. the code can change, or codesandbox might be in the loading state
  chromatic: { disableSnapshot: true },
};

export default parameters;
