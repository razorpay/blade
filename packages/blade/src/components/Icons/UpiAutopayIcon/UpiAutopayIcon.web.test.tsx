import renderWithTheme from '~utils/testing/renderWithTheme.web';

import UpiAutopayIcon from './';

describe('<UpiAutopayIcon />', () => {
  it('should render UpiAutopayIcon', () => {
    const { container } = renderWithTheme(
      <UpiAutopayIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
