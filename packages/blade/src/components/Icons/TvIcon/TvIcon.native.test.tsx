import TvIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<TvIcon />', () => {
  it('should render TvIcon', () => {
    const renderTree = renderWithTheme(
      <TvIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
