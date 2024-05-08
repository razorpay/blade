import FlagIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<FlagIcon />', () => {
  it('should render FlagIcon', () => {
    const { container } = renderWithTheme(
      <FlagIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
