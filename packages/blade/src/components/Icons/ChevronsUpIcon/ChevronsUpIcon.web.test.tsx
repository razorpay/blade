import ChevronsUpIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ChevronsUpIcon />', () => {
  it('should render ChevronsUpIcon', () => {
    const { container } = renderWithTheme(
      <ChevronsUpIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
