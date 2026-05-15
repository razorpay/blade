import renderWithTheme from '~utils/testing/renderWithTheme.web';

import TvIcon from './';

describe('<TvIcon />', () => {
  it('should render TvIcon', () => {
    const { container } = renderWithTheme(
      <TvIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
