import InvoicesIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<InvoicesIcon />', () => {
  it('should render InvoicesIcon', () => {
    const { container } = renderWithTheme(
      <InvoicesIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
