import renderWithTheme from '~utils/testing/renderWithTheme.web';

import InvoicesFilledIcon from './';

describe('<InvoicesFilledIcon />', () => {
  it('should render InvoicesFilledIcon', () => {
    const { container } = renderWithTheme(
      <InvoicesFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
