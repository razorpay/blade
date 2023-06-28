import ChevronsDownIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ChevronsDownIcon />', () => {
  it('should render ChevronsDownIcon', () => {
    const { container } = renderWithTheme(
      <ChevronsDownIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
