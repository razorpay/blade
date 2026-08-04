import { AnnouncementBanner } from '../';
import { AnnouncementIcon } from '~components/Icons';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<AnnouncementBanner />', () => {
  it('should render AnnouncementBanner on server', () => {
    const { container } = renderWithSSR(
      <AnnouncementBanner icon={AnnouncementIcon}>Enter promotional text here</AnnouncementBanner>,
    );

    expect(container).toMatchSnapshot();
  });
});
