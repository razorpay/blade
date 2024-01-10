import { Link } from '~components/Link';

const ScrollLink = ({
  children,
  href,
  size = 'small',
}: {
  children: string;
  href: string;
  size?: 'small' | 'medium';
}): JSX.Element => (
  <Link
    size={size}
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
