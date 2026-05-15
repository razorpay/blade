import renderWithTheme from '~utils/testing/renderWithTheme.native';

import PercentIcon from '.';

describe('<PercentIcon />', () => {
  it('should render PercentIcon', () => {
    const renderTree = renderWithTheme(
      <PercentIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
