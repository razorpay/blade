import CopyrightIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CopyrightIcon />', () => {
  it('should render CopyrightIcon', () => {
    const renderTree = renderWithTheme(
      <CopyrightIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
