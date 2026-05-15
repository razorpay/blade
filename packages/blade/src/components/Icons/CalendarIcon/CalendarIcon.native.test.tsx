import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CalendarIcon from '.';

describe('<CalendarIcon />', () => {
  it('should render CalendarIcon', () => {
    const renderTree = renderWithTheme(
      <CalendarIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
