import CloudDrizzleIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CloudDrizzleIcon />', () => {
  it('should render CloudDrizzleIcon', () => {
    const { container } = renderWithTheme(
      <CloudDrizzleIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
