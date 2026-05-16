import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ViewLiveDemoIcon from './';

describe('<ViewLiveDemoIcon />', () => {
  it('should render ViewLiveDemoIcon', () => {
    const { container } = renderWithTheme(
      <ViewLiveDemoIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
