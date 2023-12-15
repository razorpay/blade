import ItalicIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ItalicIcon />', () => {
  it('should render ItalicIcon', () => {
    const { container } = renderWithTheme(
      <ItalicIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
