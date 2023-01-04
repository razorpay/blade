import ChevronsUpIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<ChevronsUpIcon />', () => {
  it('should render ChevronsUpIcon', () => {
    const { container } = renderWithTheme(
      <ChevronsUpIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
