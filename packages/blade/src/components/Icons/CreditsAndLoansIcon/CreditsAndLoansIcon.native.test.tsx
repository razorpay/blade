import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CreditsAndLoansIcon from '.';

describe('<CreditsAndLoansIcon />', () => {
  it('should render CreditsAndLoansIcon', () => {
    const renderTree = renderWithTheme(
      <CreditsAndLoansIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
