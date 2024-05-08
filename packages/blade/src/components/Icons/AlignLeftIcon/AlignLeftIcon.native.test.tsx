import AlignLeftIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<AlignLeftIcon />', () => {
  it('should render AlignLeftIcon', () => {
    const renderTree = renderWithTheme(
      <AlignLeftIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
