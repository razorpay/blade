import ThumbsDownIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<ThumbsDownIcon />', () => {
  it('should render ThumbsDownIcon', () => {
    const renderTree = renderWithTheme(
      <ThumbsDownIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
