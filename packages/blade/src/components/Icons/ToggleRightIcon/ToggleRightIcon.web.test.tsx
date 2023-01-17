import ToggleRightIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<ToggleRightIcon />', () => {
  it('should render ToggleRightIcon', () => {
    const { container } = renderWithTheme(
      <ToggleRightIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
