import renderWithTheme from '~utils/testing/renderWithTheme.native';

import DollarIcon from '.';

describe('<DollarIcon />', () => {
  it('should render DollarIcon', () => {
    const renderTree = renderWithTheme(
      <DollarIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
