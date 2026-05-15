import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CreditsAndLoansFilledIcon from '.';

describe('<CreditsAndLoansFilledIcon />', () => {
  it('should render CreditsAndLoansFilledIcon', () => {
    const renderTree = renderWithTheme(
      <CreditsAndLoansFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
