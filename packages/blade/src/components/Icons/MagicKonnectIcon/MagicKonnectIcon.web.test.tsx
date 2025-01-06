import MagicKonnectIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<MagicKonnectIcon />', () => {
  it('should render MagicKonnectIcon', () => {
    const { container } = renderWithTheme(
      <MagicKonnectIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
