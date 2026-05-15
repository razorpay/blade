import renderWithTheme from '~utils/testing/renderWithTheme.native';

import EngageFilledIcon from '.';

describe('<EngageFilledIcon />', () => {
  it('should render EngageFilledIcon', () => {
    const renderTree = renderWithTheme(
      <EngageFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
