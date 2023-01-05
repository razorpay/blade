import ClockIcon from './ClockIcon';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<ClockIcon />', () => {
  it('should render ChevronUpIcon', () => {
    const { container } = renderWithTheme(
      <ClockIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
