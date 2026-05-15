import renderWithTheme from '~utils/testing/renderWithTheme.native';

import LoansForBusinessesIcon from '.';

describe('<LoansForBusinessesIcon />', () => {
  it('should render LoansForBusinessesIcon', () => {
    const renderTree = renderWithTheme(
      <LoansForBusinessesIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
