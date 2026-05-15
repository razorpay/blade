import renderWithTheme from '~utils/testing/renderWithTheme.web';

import DisbursePaymentsIcon from './';

describe('<DisbursePaymentsIcon />', () => {
  it('should render DisbursePaymentsIcon', () => {
    const { container } = renderWithTheme(
      <DisbursePaymentsIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
