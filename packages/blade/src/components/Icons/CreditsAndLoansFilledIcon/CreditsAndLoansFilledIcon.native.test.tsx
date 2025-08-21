import CreditsAndLoansFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CreditsAndLoansFilledIcon />', () => {
  it('should render CreditsAndLoansFilledIcon', () => {
    const renderTree = renderWithTheme(
      <CreditsAndLoansFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
