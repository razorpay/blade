import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CoinsIcon from './';

describe('<CoinsIcon />', () => {
  it('should render CoinsIcon', () => {
    const { container } = renderWithTheme(
      <CoinsIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
