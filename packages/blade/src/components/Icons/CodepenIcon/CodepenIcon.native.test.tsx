import CodepenIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CodepenIcon />', () => {
  it('should render CodepenIcon', () => {
    const renderTree = renderWithTheme(
      <CodepenIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
