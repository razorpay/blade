import CashIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CashIcon />', () => {
  it('should render CashIcon', () => {
    const { container } = renderWithTheme(
      <CashIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
