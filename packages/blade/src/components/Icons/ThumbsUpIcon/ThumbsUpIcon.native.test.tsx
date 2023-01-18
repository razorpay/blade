import ThumbsUpIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<ThumbsUpIcon />', () => {
  it('should render ThumbsUpIcon', () => {
    const renderTree = renderWithTheme(
      <ThumbsUpIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
