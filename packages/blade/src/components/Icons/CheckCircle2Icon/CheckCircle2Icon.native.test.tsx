import CheckCircle2Icon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CheckCircle2Icon />', () => {
  it('should render CheckCircle2Icon', () => {
    const renderTree = renderWithTheme(
      <CheckCircle2Icon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
