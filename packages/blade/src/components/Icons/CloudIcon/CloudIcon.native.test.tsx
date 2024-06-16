import CloudIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CloudIcon />', () => {
  it('should render CloudIcon', () => {
    const renderTree = renderWithTheme(
      <CloudIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
