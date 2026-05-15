import renderWithTheme from '~utils/testing/renderWithTheme.web';

import HashIcon from './';

describe('<HashIcon />', () => {
  it('should render HashIcon', () => {
    const { container } = renderWithTheme(
      <HashIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
