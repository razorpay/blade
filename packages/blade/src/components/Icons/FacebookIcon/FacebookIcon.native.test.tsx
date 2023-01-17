import FacebookIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<FacebookIcon />', () => {
  it('should render FacebookIcon', () => {
    const renderTree = renderWithTheme(
      <FacebookIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
