import AwardIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<AwardIcon />', () => {
  it('should render AwardIcon', () => {
    const { container } = renderWithTheme(
      <AwardIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
