import ClockIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ClockIcon />', () => {
  it('should render ClockIcon', () => {
    const renderTree = renderWithTheme(
      <ClockIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
