import renderWithTheme from '~utils/testing/renderWithTheme.native';

import AirplayIcon from '.';

describe('<AirplayIcon />', () => {
  it('should render AirplayIcon', () => {
    const renderTree = renderWithTheme(
      <AirplayIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
