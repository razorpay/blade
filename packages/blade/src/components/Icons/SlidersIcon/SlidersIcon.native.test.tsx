import renderWithTheme from '~utils/testing/renderWithTheme.native';

import SlidersIcon from '.';

describe('<SlidersIcon />', () => {
  it('should render SlidersIcon', () => {
    const renderTree = renderWithTheme(
      <SlidersIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
