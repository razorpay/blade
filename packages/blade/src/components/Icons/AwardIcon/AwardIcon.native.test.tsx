import AwardIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<AwardIcon />', () => {
  it('should render AwardIcon', () => {
    const renderTree = renderWithTheme(
      <AwardIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
