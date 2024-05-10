import ConfettiIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ConfettiIcon />', () => {
  it('should render ConfettiIcon', () => {
    const renderTree = renderWithTheme(
      <ConfettiIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
