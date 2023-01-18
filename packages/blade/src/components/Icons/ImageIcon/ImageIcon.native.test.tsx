import ImageIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<ImageIcon />', () => {
  it('should render ImageIcon', () => {
    const renderTree = renderWithTheme(
      <ImageIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
