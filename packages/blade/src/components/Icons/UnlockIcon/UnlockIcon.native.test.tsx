import renderWithTheme from '~utils/testing/renderWithTheme.native';

import UnlockIcon from '.';

describe('<UnlockIcon />', () => {
  it('should render UnlockIcon', () => {
    const renderTree = renderWithTheme(
      <UnlockIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
