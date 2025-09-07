import OptimizerFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<OptimizerFilledIcon />', () => {
  it('should render OptimizerFilledIcon', () => {
    const { container } = renderWithTheme(
      <OptimizerFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
