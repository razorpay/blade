import FileMinusIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<FileMinusIcon />', () => {
  it('should render FileMinusIcon', () => {
    const renderTree = renderWithTheme(
      <FileMinusIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
