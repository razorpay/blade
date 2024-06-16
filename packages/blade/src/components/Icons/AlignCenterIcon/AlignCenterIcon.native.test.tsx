import AlignCenterIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<AlignCenterIcon />', () => {
  it('should render AlignCenterIcon', () => {
    const renderTree = renderWithTheme(
      <AlignCenterIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
