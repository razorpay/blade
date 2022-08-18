import AlertIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<AlertIcon />', () => {
  it('should render AlertIcon', () => {
    const renderTree = renderWithTheme(
      <AlertIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
