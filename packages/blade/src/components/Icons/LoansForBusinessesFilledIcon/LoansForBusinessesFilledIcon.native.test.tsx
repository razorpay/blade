import renderWithTheme from '~utils/testing/renderWithTheme.native';

import LoansForBusinessesFilledIcon from '.';

describe('<LoansForBusinessesFilledIcon />', () => {
  it('should render LoansForBusinessesFilledIcon', () => {
    const renderTree = renderWithTheme(
      <LoansForBusinessesFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
