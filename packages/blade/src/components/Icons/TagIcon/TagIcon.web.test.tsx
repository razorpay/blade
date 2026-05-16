import renderWithTheme from '~utils/testing/renderWithTheme.web';

import TagIcon from './';

describe('<TagIcon />', () => {
  it('should render TagIcon', () => {
    const { container } = renderWithTheme(
      <TagIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
