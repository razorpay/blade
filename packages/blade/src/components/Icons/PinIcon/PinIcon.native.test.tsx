import renderWithTheme from '~utils/testing/renderWithTheme.native';

import PinIcon from '.';

describe('<PinIcon />', () => {
  it('should render PinIcon', () => {
    const renderTree = renderWithTheme(
      <PinIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
