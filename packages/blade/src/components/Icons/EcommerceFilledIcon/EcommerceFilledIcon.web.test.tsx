import renderWithTheme from '~utils/testing/renderWithTheme.web';

import EcommerceFilledIcon from './';

describe('<EcommerceFilledIcon />', () => {
  it('should render EcommerceFilledIcon', () => {
    const { container } = renderWithTheme(
      <EcommerceFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
