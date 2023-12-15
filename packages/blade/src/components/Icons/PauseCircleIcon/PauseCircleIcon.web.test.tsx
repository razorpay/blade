import PauseCircleIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PauseCircleIcon />', () => {
  it('should render PauseCircleIcon', () => {
    const { container } = renderWithTheme(
      <PauseCircleIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
