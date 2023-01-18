import CornerDownLeftIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<CornerDownLeftIcon />', () => {
  it('should render CornerDownLeftIcon', () => {
    const renderTree = renderWithTheme(
      <CornerDownLeftIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
