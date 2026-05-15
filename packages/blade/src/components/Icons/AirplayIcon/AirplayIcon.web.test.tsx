import renderWithTheme from '~utils/testing/renderWithTheme.web';

import AirplayIcon from './';

describe('<AirplayIcon />', () => {
  it('should render AirplayIcon', () => {
    const { container } = renderWithTheme(
      <AirplayIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
