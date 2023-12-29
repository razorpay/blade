import HistoryIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<HistoryIcon />', () => {
  it('should render HistoryIcon', () => {
    const renderTree = renderWithTheme(
      <HistoryIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
