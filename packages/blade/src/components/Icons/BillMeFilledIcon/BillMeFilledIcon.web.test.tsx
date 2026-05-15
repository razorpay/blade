import renderWithTheme from '~utils/testing/renderWithTheme.web';

import BillMeFilledIcon from './';

describe('<BillMeFilledIcon />', () => {
  it('should render BillMeFilledIcon', () => {
    const { container } = renderWithTheme(
      <BillMeFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
