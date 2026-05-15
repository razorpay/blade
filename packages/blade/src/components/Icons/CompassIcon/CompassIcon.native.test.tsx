import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CompassIcon from '.';

describe('<CompassIcon />', () => {
  it('should render CompassIcon', () => {
    const renderTree = renderWithTheme(
      <CompassIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
