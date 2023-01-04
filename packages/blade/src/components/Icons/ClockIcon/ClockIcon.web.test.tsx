import ClockIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<ClockIcon />', () => {
  it('should render ClockIcon', () => {
    const { container } = renderWithTheme(
      <ClockIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
