import CornerDownLeftIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CornerDownLeftIcon />', () => {
  it('should render CornerDownLeftIcon', () => {
    const renderTree = renderWithTheme(
      <CornerDownLeftIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
