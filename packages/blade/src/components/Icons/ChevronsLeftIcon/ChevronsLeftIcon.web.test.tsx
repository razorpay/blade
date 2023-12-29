import ChevronsLeftIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ChevronsLeftIcon />', () => {
  it('should render ChevronsLeftIcon', () => {
    const { container } = renderWithTheme(
      <ChevronsLeftIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
