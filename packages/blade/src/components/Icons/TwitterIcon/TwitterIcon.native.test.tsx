import TwitterIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<TwitterIcon />', () => {
  it('should render TwitterIcon', () => {
    const renderTree = renderWithTheme(
      <TwitterIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
