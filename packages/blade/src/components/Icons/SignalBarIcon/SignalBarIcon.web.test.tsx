import SignalBarIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<SignalBarIcon />', () => {
  it('should render SignalBarIcon', () => {
    const { container } = renderWithTheme(
      <SignalBarIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
