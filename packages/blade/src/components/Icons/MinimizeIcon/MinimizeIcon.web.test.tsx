import renderWithTheme from '~utils/testing/renderWithTheme.web';

import MinimizeIcon from './';

describe('<MinimizeIcon />', () => {
  it('should render MinimizeIcon', () => {
    const { container } = renderWithTheme(
      <MinimizeIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
