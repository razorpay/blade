import SignalBarIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<SignalBarIcon />', () => {
  it('should render SignalBarIcon', () => {
    const renderTree = renderWithTheme(
      <SignalBarIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
