import TokenHqFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<TokenHqFilledIcon />', () => {
  it('should render TokenHqFilledIcon', () => {
    const renderTree = renderWithTheme(
      <TokenHqFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
