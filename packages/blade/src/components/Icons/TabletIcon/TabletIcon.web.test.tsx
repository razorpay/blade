import TabletIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<TabletIcon />', () => {
  it('should render TabletIcon', () => {
    const { container } = renderWithTheme(
      <TabletIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
