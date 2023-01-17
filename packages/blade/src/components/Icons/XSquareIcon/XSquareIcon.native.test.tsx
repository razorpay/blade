import XSquareIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<XSquareIcon />', () => {
  it('should render XSquareIcon', () => {
    const renderTree = renderWithTheme(
      <XSquareIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
