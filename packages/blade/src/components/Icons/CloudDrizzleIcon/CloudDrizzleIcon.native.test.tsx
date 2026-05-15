import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CloudDrizzleIcon from '.';

describe('<CloudDrizzleIcon />', () => {
  it('should render CloudDrizzleIcon', () => {
    const renderTree = renderWithTheme(
      <CloudDrizzleIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
