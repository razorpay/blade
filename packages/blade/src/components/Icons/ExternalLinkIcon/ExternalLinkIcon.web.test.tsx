import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ExternalLinkIcon from './';

describe('<ExternalLinkIcon />', () => {
  it('should render ExternalLinkIcon', () => {
    const { container } = renderWithTheme(
      <ExternalLinkIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
