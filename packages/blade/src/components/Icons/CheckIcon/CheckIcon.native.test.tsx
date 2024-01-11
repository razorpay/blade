import CheckIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CheckIcon />', () => {
  it('should render CheckIcon', () => {
    const renderTree = renderWithTheme(
      <CheckIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
