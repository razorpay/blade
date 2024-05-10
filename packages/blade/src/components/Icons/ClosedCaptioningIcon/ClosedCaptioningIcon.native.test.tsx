import ClosedCaptioningIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ClosedCaptioningIcon />', () => {
  it('should render ClosedCaptioningIcon', () => {
    const renderTree = renderWithTheme(
      <ClosedCaptioningIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
