import renderWithTheme from '~utils/testing/renderWithTheme.native';

import SourceToPayFilledIcon from '.';

describe('<SourceToPayFilledIcon />', () => {
  it('should render SourceToPayFilledIcon', () => {
    const renderTree = renderWithTheme(
      <SourceToPayFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
