import BriefcaseIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<BriefcaseIcon />', () => {
  it('should render BriefcaseIcon', () => {
    const { container } = renderWithTheme(
      <BriefcaseIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
