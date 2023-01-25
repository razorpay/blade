import MusicIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<MusicIcon />', () => {
  it('should render MusicIcon', () => {
    const renderTree = renderWithTheme(
      <MusicIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
