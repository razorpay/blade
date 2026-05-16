import renderWithTheme from '~utils/testing/renderWithTheme.native';

import EducationFilledIcon from '.';

describe('<EducationFilledIcon />', () => {
  it('should render EducationFilledIcon', () => {
    const renderTree = renderWithTheme(
      <EducationFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
