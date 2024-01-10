import CloseIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CloseIcon />', () => {
  it('should render CloseIcon', () => {
    const renderTree = renderWithTheme(
      <CloseIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
