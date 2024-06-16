import CompassIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CompassIcon />', () => {
  it('should render CompassIcon', () => {
    const renderTree = renderWithTheme(
      <CompassIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
