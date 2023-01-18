import Link from '../Link';
import renderWithSSR from '~src/_helpers/testing/renderWithSSR.web';

describe('<Link />', () => {
  it('should render link with a default rel set when target is _blank', () => {
    const linkText = 'Learn More';
    const { container, getByRole, getByText } = renderWithSSR(
      // nosemgrep
      <Link href="https://www.google.com/" target="_blank">
        {linkText}
      </Link>,
    );
    expect(getByRole('link')).toBeInTheDocument();
    expect(getByText('Learn More')).toBeInTheDocument();
    expect(getByRole('link')).toHaveAttribute('href', 'https://www.google.com/');
    expect(getByRole('link')).toHaveAttribute('target', '_blank');
    expect(getByRole('link')).toHaveAttribute('rel', 'noreferrer noopener');
    expect(container).toMatchSnapshot();
  });
});
