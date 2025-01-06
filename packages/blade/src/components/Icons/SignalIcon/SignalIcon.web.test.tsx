import SignalIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<SignalIcon />', () => {
  it('should render SignalIcon', () => {
    const { container } = renderWithTheme(
      <SignalIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
