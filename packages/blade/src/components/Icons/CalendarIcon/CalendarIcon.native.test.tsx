import CalendarIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<CalendarIcon />', () => {
  it('should render CalendarIcon', () => {
    const renderTree = renderWithTheme(
      <CalendarIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
