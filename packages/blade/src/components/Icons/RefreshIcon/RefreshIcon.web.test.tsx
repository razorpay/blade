import renderWithTheme from '~utils/testing/renderWithTheme.web';

import RefreshIcon from './';

describe('<RefreshIcon />', () => {
  it('should render RefreshIcon', () => {
    const { container } = renderWithTheme(
      <RefreshIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
