import TestIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<TestIcon />', () => {
  it('should render TestIcon', () => {
    const renderTree = renderWithTheme(
      <TestIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
