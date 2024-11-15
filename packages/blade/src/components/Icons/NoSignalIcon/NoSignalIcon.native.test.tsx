import NoSignalIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<NoSignalIcon />', () => {
  it('should render NoSignalIcon', () => {
    const renderTree = renderWithTheme(
      <NoSignalIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
