import ClosedCaptioningIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ClosedCaptioningIcon />', () => {
  it('should render ClosedCaptioningIcon', () => {
    const { container } = renderWithTheme(
      <ClosedCaptioningIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
