import renderWithTheme from '~utils/testing/renderWithTheme.web';

import LoansForBusinessesFilledIcon from './';

describe('<LoansForBusinessesFilledIcon />', () => {
  it('should render LoansForBusinessesFilledIcon', () => {
    const { container } = renderWithTheme(
      <LoansForBusinessesFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
