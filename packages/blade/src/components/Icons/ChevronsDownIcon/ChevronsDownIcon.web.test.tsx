import ChevronsDownIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<ChevronsDownIcon />', () => {
  it('should render ChevronsDownIcon', () => {
    const { container } = renderWithTheme(
      <ChevronsDownIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
