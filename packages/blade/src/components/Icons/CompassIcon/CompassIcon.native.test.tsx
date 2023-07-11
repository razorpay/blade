import CompassIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CompassIcon />', () => {
  it('should render CompassIcon', () => {
    const renderTree = renderWithTheme(
      <CompassIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
