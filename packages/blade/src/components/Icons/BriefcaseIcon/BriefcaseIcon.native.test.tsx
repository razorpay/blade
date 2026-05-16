import renderWithTheme from '~utils/testing/renderWithTheme.native';

import BriefcaseIcon from '.';

describe('<BriefcaseIcon />', () => {
  it('should render BriefcaseIcon', () => {
    const renderTree = renderWithTheme(
      <BriefcaseIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
