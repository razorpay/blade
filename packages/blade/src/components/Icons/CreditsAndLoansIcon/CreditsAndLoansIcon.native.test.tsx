import CreditsAndLoansIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CreditsAndLoansIcon />', () => {
  it('should render CreditsAndLoansIcon', () => {
    const renderTree = renderWithTheme(
      <CreditsAndLoansIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
