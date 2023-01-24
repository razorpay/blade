import AnchorIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<AnchorIcon />', () => {
  it('should render AnchorIcon', () => {
    const renderTree = renderWithTheme(
      <AnchorIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
