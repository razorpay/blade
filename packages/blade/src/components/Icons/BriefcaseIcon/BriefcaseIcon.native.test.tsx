import BriefcaseIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<BriefcaseIcon />', () => {
  it('should render BriefcaseIcon', () => {
    const renderTree = renderWithTheme(
      <BriefcaseIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
