import ToggleLeftIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<ToggleLeftIcon />', () => {
  it('should render ToggleLeftIcon', () => {
    const { container } = renderWithTheme(
      <ToggleLeftIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
