import PinIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PinIcon />', () => {
  it('should render PinIcon', () => {
    const renderTree = renderWithTheme(
      <PinIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
