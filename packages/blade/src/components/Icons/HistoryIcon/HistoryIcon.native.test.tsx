import renderWithTheme from '../../../_helpers/testing/renderWithTheme.native';
import HistoryIcon from '.';

describe('<HistoryIcon />', () => {
  it('should render HistoryIcon', () => {
    const renderTree = renderWithTheme(
      <HistoryIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
