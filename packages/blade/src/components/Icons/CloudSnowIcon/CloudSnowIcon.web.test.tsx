import CloudSnowIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CloudSnowIcon />', () => {
  it('should render CloudSnowIcon', () => {
    const { container } = renderWithTheme(
      <CloudSnowIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
