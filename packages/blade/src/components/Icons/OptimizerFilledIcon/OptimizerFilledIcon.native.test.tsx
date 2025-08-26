import OptimizerFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<OptimizerFilledIcon />', () => {
  it('should render OptimizerFilledIcon', () => {
    const renderTree = renderWithTheme(
      <OptimizerFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
