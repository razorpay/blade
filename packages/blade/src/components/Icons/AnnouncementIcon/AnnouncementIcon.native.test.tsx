import AnnouncementIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<AnnouncementIcon />', () => {
  it('should render AnnouncementIcon', () => {
    const renderTree = renderWithTheme(
      <AnnouncementIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
