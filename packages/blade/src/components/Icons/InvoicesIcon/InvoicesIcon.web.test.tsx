import renderWithTheme from '~utils/testing/renderWithTheme.web';

import InvoicesIcon from './';

describe('<InvoicesIcon />', () => {
  it('should render InvoicesIcon', () => {
    const { container } = renderWithTheme(
      <InvoicesIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
