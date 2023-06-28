import ShareIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ShareIcon />', () => {
  it('should render ShareIcon', () => {
    const renderTree = renderWithTheme(
      <ShareIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
