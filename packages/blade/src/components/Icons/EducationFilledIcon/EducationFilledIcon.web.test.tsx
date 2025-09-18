import EducationFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<EducationFilledIcon />', () => {
  it('should render EducationFilledIcon', () => {
    const { container } = renderWithTheme(
      <EducationFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
