import LoansForBusinessesIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<LoansForBusinessesIcon />', () => {
  it('should render LoansForBusinessesIcon', () => {
    const renderTree = renderWithTheme(
      <LoansForBusinessesIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
