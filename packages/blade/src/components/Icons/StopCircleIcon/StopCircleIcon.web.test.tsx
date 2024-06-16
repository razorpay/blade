import StopCircleIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<StopCircleIcon />', () => {
  it('should render StopCircleIcon', () => {
    const { container } = renderWithTheme(
      <StopCircleIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
