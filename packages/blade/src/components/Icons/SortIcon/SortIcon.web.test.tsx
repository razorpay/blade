import SortIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<SortIcon />', () => {
  it('should render SortIcon', () => {
    const { container } = renderWithTheme(
      <SortIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
