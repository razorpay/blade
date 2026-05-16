import renderWithTheme from '~utils/testing/renderWithTheme.native';

import GlobeIcon from '.';

describe('<GlobeIcon />', () => {
  it('should render GlobeIcon', () => {
    const renderTree = renderWithTheme(
      <GlobeIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
