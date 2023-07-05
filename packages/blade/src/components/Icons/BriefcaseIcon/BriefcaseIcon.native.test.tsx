import BriefcaseIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<BriefcaseIcon />', () => {
  it('should render BriefcaseIcon', () => {
    const renderTree = renderWithTheme(
      <BriefcaseIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
