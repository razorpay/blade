import MagicKonnectFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<MagicKonnectFilledIcon />', () => {
  it('should render MagicKonnectFilledIcon', () => {
    const { container } = renderWithTheme(
      <MagicKonnectFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
