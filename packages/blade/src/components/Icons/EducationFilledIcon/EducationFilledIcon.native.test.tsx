import EducationFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<EducationFilledIcon />', () => {
  it('should render EducationFilledIcon', () => {
    const renderTree = renderWithTheme(
      <EducationFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
