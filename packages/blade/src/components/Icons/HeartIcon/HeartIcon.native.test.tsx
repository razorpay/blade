import HeartIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<HeartIcon />', () => {
  it('should render HeartIcon', () => {
    const renderTree = renderWithTheme(
      <HeartIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
