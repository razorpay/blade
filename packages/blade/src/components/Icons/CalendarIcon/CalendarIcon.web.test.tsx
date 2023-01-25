import CalendarIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<CalendarIcon />', () => {
  it('should render CalendarIcon', () => {
    const { container } = renderWithTheme(
      <CalendarIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
