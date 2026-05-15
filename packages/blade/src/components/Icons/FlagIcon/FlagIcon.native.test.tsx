import renderWithTheme from '~utils/testing/renderWithTheme.native';

import FlagIcon from '.';

describe('<FlagIcon />', () => {
  it('should render FlagIcon', () => {
    const renderTree = renderWithTheme(
      <FlagIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
