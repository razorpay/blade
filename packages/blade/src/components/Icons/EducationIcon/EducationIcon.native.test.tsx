import renderWithTheme from '~utils/testing/renderWithTheme.native';

import EducationIcon from '.';

describe('<EducationIcon />', () => {
  it('should render EducationIcon', () => {
    const renderTree = renderWithTheme(
      <EducationIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
