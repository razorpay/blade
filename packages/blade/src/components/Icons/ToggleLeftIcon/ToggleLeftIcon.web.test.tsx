import ToggleLeftIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ToggleLeftIcon />', () => {
  it('should render ToggleLeftIcon', () => {
    const { container } = renderWithTheme(
      <ToggleLeftIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
