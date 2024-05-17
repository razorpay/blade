import RupeesIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<RupeesIcon />', () => {
  it('should render RupeesIcon', () => {
    const renderTree = renderWithTheme(
      <RupeesIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
