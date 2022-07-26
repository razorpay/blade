import CloseIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<CloseIcon />', () => {
  it('should render CloseIcon', () => {
    const renderTree = renderWithTheme(
      <CloseIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
