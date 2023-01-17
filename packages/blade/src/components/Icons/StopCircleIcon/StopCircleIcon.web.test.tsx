import StopCircleIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<StopCircleIcon />', () => {
  it('should render StopCircleIcon', () => {
    const { container } = renderWithTheme(
      <StopCircleIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
