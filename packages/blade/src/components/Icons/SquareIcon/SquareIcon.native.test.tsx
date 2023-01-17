import SquareIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<SquareIcon />', () => {
  it('should render SquareIcon', () => {
    const renderTree = renderWithTheme(
      <SquareIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
