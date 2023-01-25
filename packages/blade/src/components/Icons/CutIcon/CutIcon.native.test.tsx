import CutIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<CutIcon />', () => {
  it('should render CutIcon', () => {
    const renderTree = renderWithTheme(
      <CutIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
