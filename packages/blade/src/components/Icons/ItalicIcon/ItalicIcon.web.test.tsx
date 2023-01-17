import ItalicIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<ItalicIcon />', () => {
  it('should render ItalicIcon', () => {
    const { container } = renderWithTheme(
      <ItalicIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
