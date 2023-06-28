import BoxIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<BoxIcon />', () => {
  it('should render BoxIcon', () => {
    const renderTree = renderWithTheme(
      <BoxIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
