import HistoryIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<HistoryIcon />', () => {
  it('should render HistoryIcon', () => {
    const { container } = renderWithTheme(
      <HistoryIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
