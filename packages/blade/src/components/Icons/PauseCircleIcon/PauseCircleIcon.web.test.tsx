import PauseCircleIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<PauseCircleIcon />', () => {
  it('should render PauseCircleIcon', () => {
    const { container } = renderWithTheme(
      <PauseCircleIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
