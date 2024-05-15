import ConfettiIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ConfettiIcon />', () => {
  it('should render ConfettiIcon', () => {
    const { container } = renderWithTheme(
      <ConfettiIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
