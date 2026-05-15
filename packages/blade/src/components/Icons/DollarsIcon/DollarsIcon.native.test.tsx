import renderWithTheme from '~utils/testing/renderWithTheme.native';

import DollarsIcon from '.';

describe('<DollarsIcon />', () => {
  it('should render DollarsIcon', () => {
    const renderTree = renderWithTheme(
      <DollarsIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
