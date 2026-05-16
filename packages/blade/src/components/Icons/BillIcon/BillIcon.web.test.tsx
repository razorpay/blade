import renderWithTheme from '~utils/testing/renderWithTheme.web';

import BillIcon from './';

describe('<BillIcon />', () => {
  it('should render BillIcon', () => {
    const { container } = renderWithTheme(
      <BillIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
