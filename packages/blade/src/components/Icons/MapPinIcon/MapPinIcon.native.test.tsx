import renderWithTheme from '~utils/testing/renderWithTheme.native';

import MapPinIcon from '.';

describe('<MapPinIcon />', () => {
  it('should render MapPinIcon', () => {
    const renderTree = renderWithTheme(
      <MapPinIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
