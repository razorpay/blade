// All third-party related mocks will go here.
jest.mock('react-native-reanimated', () =>
  jest.requireActual('./node_modules/react-native-reanimated/mock'),
);

jest.mock('react-native-document-picker', () => {
  return {
    pick: jest.fn(() =>
      Promise.resolve({
        uri: 'content://xyz.jpeg',
        type: 'jpeg',
        name: 'someFileName',
        size: 2345,
      }),
    ),
    types: {
      allFiles: 'allFiles',
      audio: 'audio',
      csv: 'csv',
      doc: 'doc',
      docx: 'docx',
      images: 'images',
      pdf: 'pdf',
      plainText: 'plainText',
      ppt: 'ppt',
      pptx: 'pptx',
      video: 'video',
      xls: 'xls',
      xlsx: 'xlsx',
      zip: 'zip',
    },
    isCancel: jest.fn(() => false),
  };
});

jest.mock('react-native/Libraries/LayoutAnimation/LayoutAnimation', () => ({
  ...jest.requireActual('react-native/Libraries/LayoutAnimation/LayoutAnimation'),
  easeInEaseOut: jest.fn(),
  configureNext: jest.fn(),
  create: jest.fn(),
}));
