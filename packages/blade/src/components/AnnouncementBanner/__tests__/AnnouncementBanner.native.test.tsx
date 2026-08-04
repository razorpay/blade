import { AnnouncementBanner } from '..';
import { AnnouncementIcon } from '~components/Icons';
import { BladeProvider } from '~components/BladeProvider';
import { bladeTheme } from '~tokens/theme';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<AnnouncementBanner />', () => {
  it('should render default light treatment (centered, with icon) in a light app', () => {
    const { toJSON } = renderWithTheme(
      <AnnouncementBanner icon={AnnouncementIcon}>Enter promotional text here</AnnouncementBanner>,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render the dark treatment when app colorScheme is dark', () => {
    const { toJSON } = renderWithTheme(
      <BladeProvider themeTokens={bladeTheme} colorScheme="dark">
        <AnnouncementBanner icon={AnnouncementIcon}>Enter promotional text here</AnnouncementBanner>
      </BladeProvider>,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render left aligned', () => {
    const { toJSON } = renderWithTheme(
      <AnnouncementBanner alignment="left" icon={AnnouncementIcon}>
        Enter promotional text here
      </AnnouncementBanner>,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render children text', () => {
    const { getByText } = renderWithTheme(
      <AnnouncementBanner icon={AnnouncementIcon}>Enter promotional text here</AnnouncementBanner>,
    );

    expect(getByText('Enter promotional text here')).toBeTruthy();
  });

  it('should expose an accessible region label', () => {
    const { getByLabelText } = renderWithTheme(
      <AnnouncementBanner icon={AnnouncementIcon}>Enter promotional text here</AnnouncementBanner>,
    );

    // On React Native, role="region" maps to accessibilityRole="summary",
    // so we assert on the accessible label instead of the web role.
    expect(getByLabelText('Announcement')).toBeTruthy();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <AnnouncementBanner testID="announcement-banner-test">Test</AnnouncementBanner>,
    );

    expect(getByTestId('announcement-banner-test')).toBeTruthy();
  });
});
