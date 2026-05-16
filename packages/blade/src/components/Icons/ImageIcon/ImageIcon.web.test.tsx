import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ImageIcon from './';

describe('<ImageIcon />', () => {
  it('should render ImageIcon', () => {
    const { container } = renderWithTheme(
      <ImageIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
