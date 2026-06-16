import ClockFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ClockFilledIcon />', () => {
  it('should render ClockFilledIcon', () => {
    const renderTree = renderWithTheme(
      <ClockFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
