import CurrentAccountFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CurrentAccountFilledIcon />', () => {
  it('should render CurrentAccountFilledIcon', () => {
    const renderTree = renderWithTheme(
      <CurrentAccountFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
