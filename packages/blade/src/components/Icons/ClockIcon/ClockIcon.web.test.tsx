import ClockIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ClockIcon />', () => {
  it('should render ClockIcon', () => {
    const { container } = renderWithTheme(
      <ClockIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
