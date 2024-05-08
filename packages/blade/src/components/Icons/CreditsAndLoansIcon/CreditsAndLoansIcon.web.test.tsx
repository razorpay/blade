import CreditsAndLoansIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CreditsAndLoansIcon />', () => {
  it('should render CreditsAndLoansIcon', () => {
    const { container } = renderWithTheme(
      <CreditsAndLoansIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
