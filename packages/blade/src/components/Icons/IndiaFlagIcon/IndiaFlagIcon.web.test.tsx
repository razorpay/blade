import IndiaFlagIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<IndiaFlagIcon />', () => {
  it('should render IndiaFlagIcon', () => {
    const { container } = renderWithTheme(
      <IndiaFlagIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
