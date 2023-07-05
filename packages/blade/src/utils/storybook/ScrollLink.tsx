import { Link } from '~components/Link';

const ScrollLink = ({ children, href }: { children: string; href: string }): JSX.Element => (
  <Link
    size="small"
    variant="button"
    onClick={() => {
      document.querySelector(href)?.scrollIntoView({
        behavior: 'smooth',
      });
    }}
  >
    {children}
  </Link>
);

export { ScrollLink };
