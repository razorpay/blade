import ClockFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ClockFilledIcon />', () => {
  it('should render ClockFilledIcon', () => {
    const { container } = renderWithTheme(
      <ClockFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
