import renderWithTheme from '../../../_helpers/testing/renderWithTheme.web';
import HistoryIcon from '.';

describe('<HistoryIcon />', () => {
  it('should render HistoryIcon', () => {
    const { container } = renderWithTheme(
      <HistoryIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
