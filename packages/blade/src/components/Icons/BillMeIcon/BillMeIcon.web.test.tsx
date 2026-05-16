import renderWithTheme from '~utils/testing/renderWithTheme.web';

import BillMeIcon from './';

describe('<BillMeIcon />', () => {
  it('should render BillMeIcon', () => {
    const { container } = renderWithTheme(
      <BillMeIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
