import HeadphonesIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<HeadphonesIcon />', () => {
  it('should render HeadphonesIcon', () => {
    const { container } = renderWithTheme(
      <HeadphonesIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
