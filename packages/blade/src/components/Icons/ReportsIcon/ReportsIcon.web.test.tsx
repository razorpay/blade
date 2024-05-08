import ReportsIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ReportsIcon />', () => {
  it('should render ReportsIcon', () => {
    const { container } = renderWithTheme(
      <ReportsIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
