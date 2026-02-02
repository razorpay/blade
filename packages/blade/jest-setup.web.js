import 'jest-axe/extend-expect';
import 'jest-styled-components';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock react-markdown to avoid ESM module issues in Jest
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }) => children,
}));
