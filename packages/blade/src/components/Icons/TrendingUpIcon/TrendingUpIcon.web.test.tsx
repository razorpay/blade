import renderWithTheme from '~utils/testing/renderWithTheme.web';

import TrendingUpIcon from './';

describe('<TrendingUpIcon />', () => {
  it('should render TrendingUpIcon', () => {
    const { container } = renderWithTheme(
      <TrendingUpIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
