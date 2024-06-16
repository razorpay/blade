import ActivityIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ActivityIcon />', () => {
  it('should render ActivityIcon', () => {
    const renderTree = renderWithTheme(
      <ActivityIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
