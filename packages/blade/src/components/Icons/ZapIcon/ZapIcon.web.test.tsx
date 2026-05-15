import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ZapIcon from './';

describe('<ZapIcon />', () => {
  it('should render ZapIcon', () => {
    const { container } = renderWithTheme(
      <ZapIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
