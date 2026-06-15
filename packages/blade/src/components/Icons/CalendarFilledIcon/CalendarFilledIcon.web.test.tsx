import CalendarFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CalendarFilledIcon />', () => {
  it('should render CalendarFilledIcon', () => {
    const { container } = renderWithTheme(
      <CalendarFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
