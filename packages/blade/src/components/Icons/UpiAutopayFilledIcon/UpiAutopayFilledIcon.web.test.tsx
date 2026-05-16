import renderWithTheme from '~utils/testing/renderWithTheme.web';

import UpiAutopayFilledIcon from './';

describe('<UpiAutopayFilledIcon />', () => {
  it('should render UpiAutopayFilledIcon', () => {
    const { container } = renderWithTheme(
      <UpiAutopayFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
