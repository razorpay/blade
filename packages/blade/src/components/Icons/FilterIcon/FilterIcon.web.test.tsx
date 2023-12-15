import FilterIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<FilterIcon />', () => {
  it('should render FilterIcon', () => {
    const { container } = renderWithTheme(
      <FilterIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
