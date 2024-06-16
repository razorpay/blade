import SkipBackIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<SkipBackIcon />', () => {
  it('should render SkipBackIcon', () => {
    const renderTree = renderWithTheme(
      <SkipBackIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
