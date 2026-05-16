import renderWithTheme from '~utils/testing/renderWithTheme.web';

import InternationalPaymentsFilledIcon from './';

describe('<InternationalPaymentsFilledIcon />', () => {
  it('should render InternationalPaymentsFilledIcon', () => {
    const { container } = renderWithTheme(
      <InternationalPaymentsFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
