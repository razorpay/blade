import BaseLink from '../BaseLink';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<BaseLink />', () => {
  it('should render link with a default rel set when target is _blank', () => {
    const linkText = 'Learn More';
    const { container, getByRole, getByText } = renderWithSSR(
      // nosemgrep
      <BaseLink href="https://www.google.com/" target="_blank">
        {linkText}
      </BaseLink>,
    );
    expect(getByRole('link')).toBeInTheDocument();
    expect(getByText('Learn More')).toBeInTheDocument();
    expect(getByRole('link')).toHaveAttribute('href', 'https://www.google.com/');
    expect(getByRole('link')).toHaveAttribute('target', '_blank');
    expect(getByRole('link')).toHaveAttribute('rel', 'noreferrer noopener');
    expect(container).toMatchSnapshot();
  });
});
