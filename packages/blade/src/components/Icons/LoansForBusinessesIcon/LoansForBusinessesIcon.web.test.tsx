import LoansForBusinessesIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<LoansForBusinessesIcon />', () => {
  it('should render LoansForBusinessesIcon', () => {
    const { container } = renderWithTheme(
      <LoansForBusinessesIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
