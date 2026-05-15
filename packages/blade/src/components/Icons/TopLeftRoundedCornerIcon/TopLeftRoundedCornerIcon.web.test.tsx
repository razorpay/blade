import renderWithTheme from '~utils/testing/renderWithTheme.web';

import TopLeftRoundedCornerIcon from './';

describe('<TopLeftRoundedCornerIcon />', () => {
  it('should render TopLeftRoundedCornerIcon', () => {
    const { container } = renderWithTheme(
      <TopLeftRoundedCornerIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
