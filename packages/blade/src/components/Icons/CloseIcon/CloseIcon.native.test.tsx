import CloseIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CloseIcon />', () => {
  it('should render CloseIcon', () => {
    const renderTree = renderWithTheme(
      <CloseIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
