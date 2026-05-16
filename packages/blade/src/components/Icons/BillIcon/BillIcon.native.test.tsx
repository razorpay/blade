import renderWithTheme from '~utils/testing/renderWithTheme.native';

import BillIcon from '.';

describe('<BillIcon />', () => {
  it('should render BillIcon', () => {
    const renderTree = renderWithTheme(
      <BillIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
