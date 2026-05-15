import renderWithTheme from '~utils/testing/renderWithTheme.native';

import TargetIcon from '.';

describe('<TargetIcon />', () => {
  it('should render TargetIcon', () => {
    const renderTree = renderWithTheme(
      <TargetIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
