import EducationIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<EducationIcon />', () => {
  it('should render EducationIcon', () => {
    const renderTree = renderWithTheme(
      <EducationIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
