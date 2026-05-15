import { HomeIcon } from '~components/Icons';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

import { Breadcrumb, BreadcrumbItem } from '../';

describe('<Breadcrumb />', () => {
  it('should render breadcrumb', () => {
    const { container } = renderWithSSR(
      <Breadcrumb showLastSeparator size="large">
        <BreadcrumbItem icon={HomeIcon} href="/">
          Home
        </BreadcrumbItem>
        <BreadcrumbItem href="/about">About</BreadcrumbItem>
        <BreadcrumbItem href="/contact" isCurrentPage>
          Contact
        </BreadcrumbItem>
      </Breadcrumb>,
    );
    expect(container).toMatchSnapshot();
  });
});
