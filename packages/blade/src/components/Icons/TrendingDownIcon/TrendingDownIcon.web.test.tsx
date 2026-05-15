import renderWithTheme from '~utils/testing/renderWithTheme.web';

import TrendingDownIcon from './';

describe('<TrendingDownIcon />', () => {
  it('should render TrendingDownIcon', () => {
    const { container } = renderWithTheme(
      <TrendingDownIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
