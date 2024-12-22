import SignalIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<SignalIcon />', () => {
  it('should render SignalIcon', () => {
    const renderTree = renderWithTheme(
      <SignalIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
