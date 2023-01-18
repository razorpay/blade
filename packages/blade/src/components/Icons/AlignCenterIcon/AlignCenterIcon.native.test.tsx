import AlignCenterIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<AlignCenterIcon />', () => {
  it('should render AlignCenterIcon', () => {
    const renderTree = renderWithTheme(
      <AlignCenterIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
