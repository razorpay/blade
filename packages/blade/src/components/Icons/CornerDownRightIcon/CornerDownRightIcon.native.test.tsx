import CornerDownRightIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CornerDownRightIcon />', () => {
  it('should render CornerDownRightIcon', () => {
    const renderTree = renderWithTheme(
      <CornerDownRightIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
