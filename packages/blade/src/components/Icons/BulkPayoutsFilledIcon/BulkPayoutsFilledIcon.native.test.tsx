import renderWithTheme from '~utils/testing/renderWithTheme.native';

import BulkPayoutsFilledIcon from '.';

describe('<BulkPayoutsFilledIcon />', () => {
  it('should render BulkPayoutsFilledIcon', () => {
    const renderTree = renderWithTheme(
      <BulkPayoutsFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
