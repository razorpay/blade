import MoveIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<MoveIcon />', () => {
  it('should render MoveIcon', () => {
    const renderTree = renderWithTheme(
      <MoveIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
