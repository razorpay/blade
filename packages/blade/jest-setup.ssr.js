// Mock react-markdown to avoid ESM module issues in Jest
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }) => children,
}));
