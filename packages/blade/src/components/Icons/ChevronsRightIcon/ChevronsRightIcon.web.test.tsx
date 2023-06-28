import ChevronsRightIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ChevronsRightIcon />', () => {
  it('should render ChevronsRightIcon', () => {
    const { container } = renderWithTheme(
      <ChevronsRightIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
