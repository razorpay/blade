import AlertCircleIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<AlertCircleIcon />', () => {
  it('should render AlertCircleIcon', () => {
    const renderTree = renderWithTheme(
      <AlertCircleIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
