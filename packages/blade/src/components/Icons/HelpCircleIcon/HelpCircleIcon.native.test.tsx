import renderWithTheme from '~utils/testing/renderWithTheme.native';

import HelpCircleIcon from '.';

describe('<HelpCircleIcon />', () => {
  it('should render HelpCircleIcon', () => {
    const renderTree = renderWithTheme(
      <HelpCircleIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
