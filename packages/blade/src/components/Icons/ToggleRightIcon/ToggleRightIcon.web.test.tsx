import ToggleRightIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ToggleRightIcon />', () => {
  it('should render ToggleRightIcon', () => {
    const { container } = renderWithTheme(
      <ToggleRightIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
