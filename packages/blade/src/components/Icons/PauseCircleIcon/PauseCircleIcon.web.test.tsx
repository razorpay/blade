import PauseCircleIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PauseCircleIcon />', () => {
  it('should render PauseCircleIcon', () => {
    const { container } = renderWithTheme(
      <PauseCircleIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
