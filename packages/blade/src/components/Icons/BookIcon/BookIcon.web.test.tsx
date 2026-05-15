import renderWithTheme from '~utils/testing/renderWithTheme.web';

import BookIcon from './';

describe('<BookIcon />', () => {
  it('should render BookIcon', () => {
    const { container } = renderWithTheme(
      <BookIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
