import renderWithTheme from '~utils/testing/renderWithTheme.web';

import InternationalPaymentsIcon from './';

describe('<InternationalPaymentsIcon />', () => {
  it('should render InternationalPaymentsIcon', () => {
    const { container } = renderWithTheme(
      <InternationalPaymentsIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
