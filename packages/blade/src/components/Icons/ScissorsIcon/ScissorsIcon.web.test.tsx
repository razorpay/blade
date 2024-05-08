import ScissorsIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ScissorsIcon />', () => {
  it('should render ScissorsIcon', () => {
    const { container } = renderWithTheme(
      <ScissorsIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
