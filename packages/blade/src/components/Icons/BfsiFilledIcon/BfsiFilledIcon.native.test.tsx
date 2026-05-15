import renderWithTheme from '~utils/testing/renderWithTheme.native';

import BfsiFilledIcon from '.';

describe('<BfsiFilledIcon />', () => {
  it('should render BfsiFilledIcon', () => {
    const renderTree = renderWithTheme(
      <BfsiFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
