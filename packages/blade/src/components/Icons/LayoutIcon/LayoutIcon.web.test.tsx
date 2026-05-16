import renderWithTheme from '~utils/testing/renderWithTheme.web';

import LayoutIcon from './';

describe('<LayoutIcon />', () => {
  it('should render LayoutIcon', () => {
    const { container } = renderWithTheme(
      <LayoutIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
