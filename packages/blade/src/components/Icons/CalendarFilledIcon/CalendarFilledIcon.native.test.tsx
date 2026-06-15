import CalendarFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CalendarFilledIcon />', () => {
  it('should render CalendarFilledIcon', () => {
    const renderTree = renderWithTheme(
      <CalendarFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
