import renderWithTheme from '~utils/testing/renderWithTheme.native';

import LockIcon from '.';

describe('<LockIcon />', () => {
  it('should render LockIcon', () => {
    const renderTree = renderWithTheme(
      <LockIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
