import ItalicIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<ItalicIcon />', () => {
  it('should render ItalicIcon', () => {
    const renderTree = renderWithTheme(
      <ItalicIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
