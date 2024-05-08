import EducationIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<EducationIcon />', () => {
  it('should render EducationIcon', () => {
    const { container } = renderWithTheme(
      <EducationIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
