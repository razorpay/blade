import AirplayIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<AirplayIcon />', () => {
  it('should render AirplayIcon', () => {
    const renderTree = renderWithTheme(
      <AirplayIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
