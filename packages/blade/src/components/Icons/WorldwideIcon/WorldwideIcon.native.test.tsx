import WorldwideIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<WorldwideIcon />', () => {
  it('should render WorldwideIcon', () => {
    const renderTree = renderWithTheme(
      <WorldwideIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
