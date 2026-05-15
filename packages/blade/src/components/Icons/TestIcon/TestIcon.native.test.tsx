import renderWithTheme from '~utils/testing/renderWithTheme.native';

import TestIcon from '.';

describe('<TestIcon />', () => {
  it('should render TestIcon', () => {
    const renderTree = renderWithTheme(
      <TestIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
