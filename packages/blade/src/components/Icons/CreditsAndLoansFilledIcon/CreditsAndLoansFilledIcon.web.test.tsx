import CreditsAndLoansFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CreditsAndLoansFilledIcon />', () => {
  it('should render CreditsAndLoansFilledIcon', () => {
    const { container } = renderWithTheme(
      <CreditsAndLoansFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
