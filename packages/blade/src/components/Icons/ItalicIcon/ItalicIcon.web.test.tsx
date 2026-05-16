import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ItalicIcon from './';

describe('<ItalicIcon />', () => {
  it('should render ItalicIcon', () => {
    const { container } = renderWithTheme(
      <ItalicIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
