import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CopyrightIcon from '.';

describe('<CopyrightIcon />', () => {
  it('should render CopyrightIcon', () => {
    const renderTree = renderWithTheme(
      <CopyrightIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
