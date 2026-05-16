import renderWithTheme from '~utils/testing/renderWithTheme.native';

import BillMeIcon from '.';

describe('<BillMeIcon />', () => {
  it('should render BillMeIcon', () => {
    const renderTree = renderWithTheme(
      <BillMeIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
