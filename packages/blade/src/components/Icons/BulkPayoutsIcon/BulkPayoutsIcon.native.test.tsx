import renderWithTheme from '~utils/testing/renderWithTheme.native';

import BulkPayoutsIcon from '.';

describe('<BulkPayoutsIcon />', () => {
  it('should render BulkPayoutsIcon', () => {
    const renderTree = renderWithTheme(
      <BulkPayoutsIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
