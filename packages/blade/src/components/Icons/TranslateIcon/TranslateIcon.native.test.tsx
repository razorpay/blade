import TranslateIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<TranslateIcon />', () => {
  it('should render TranslateIcon', () => {
    const renderTree = renderWithTheme(
      <TranslateIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
