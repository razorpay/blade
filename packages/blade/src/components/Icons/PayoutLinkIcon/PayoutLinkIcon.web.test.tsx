import PayoutLinkIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PayoutLinkIcon />', () => {
  it('should render PayoutLinkIcon', () => {
    const { container } = renderWithTheme(
      <PayoutLinkIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
