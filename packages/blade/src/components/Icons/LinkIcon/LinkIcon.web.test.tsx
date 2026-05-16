import renderWithTheme from '~utils/testing/renderWithTheme.web';

import LinkIcon from './';

describe('<LinkIcon />', () => {
  it('should render LinkIcon', () => {
    const { container } = renderWithTheme(
      <LinkIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
