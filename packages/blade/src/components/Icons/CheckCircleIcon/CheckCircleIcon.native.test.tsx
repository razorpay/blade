import CheckCircleIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<CheckCircleIcon />', () => {
  it('should render CheckCircleIcon', () => {
    const renderTree = renderWithTheme(
      <CheckCircleIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
