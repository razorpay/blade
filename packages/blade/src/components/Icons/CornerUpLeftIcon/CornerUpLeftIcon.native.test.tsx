import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CornerUpLeftIcon from '.';

describe('<CornerUpLeftIcon />', () => {
  it('should render CornerUpLeftIcon', () => {
    const renderTree = renderWithTheme(
      <CornerUpLeftIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
