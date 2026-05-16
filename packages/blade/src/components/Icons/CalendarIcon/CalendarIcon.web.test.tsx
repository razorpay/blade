import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CalendarIcon from './';

describe('<CalendarIcon />', () => {
  it('should render CalendarIcon', () => {
    const { container } = renderWithTheme(
      <CalendarIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
