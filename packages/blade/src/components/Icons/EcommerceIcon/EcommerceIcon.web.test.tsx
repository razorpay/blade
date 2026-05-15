import renderWithTheme from '~utils/testing/renderWithTheme.web';

import EcommerceIcon from './';

describe('<EcommerceIcon />', () => {
  it('should render EcommerceIcon', () => {
    const { container } = renderWithTheme(
      <EcommerceIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
