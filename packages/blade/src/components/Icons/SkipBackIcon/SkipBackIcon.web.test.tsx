import renderWithTheme from '~utils/testing/renderWithTheme.web';

import SkipBackIcon from './';

describe('<SkipBackIcon />', () => {
  it('should render SkipBackIcon', () => {
    const { container } = renderWithTheme(
      <SkipBackIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
