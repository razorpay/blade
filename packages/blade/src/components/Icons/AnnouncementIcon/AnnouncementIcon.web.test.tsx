import AnnouncementIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<AnnouncementIcon />', () => {
  it('should render AnnouncementIcon', () => {
    const { container } = renderWithTheme(
      <AnnouncementIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
