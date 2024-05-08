import OptimizerIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<OptimizerIcon />', () => {
  it('should render OptimizerIcon', () => {
    const { container } = renderWithTheme(
      <OptimizerIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
