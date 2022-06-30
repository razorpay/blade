import renderWithTheme from '../../../_helpers/testing/renderWithTheme.web';
import PauseIcon from '.';

describe('<PauseIcon />', () => {
  it('should render PauseIcon', () => {
    const { container } = renderWithTheme(
      <PauseIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
