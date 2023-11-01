import { Hello } from './Hello';
import renderWithSSR from './renderWithSSR.web';

describe('Hello SSR', () => {
  it('should render hello world', () => {
    renderWithSSR(<Hello />);
  });
});
