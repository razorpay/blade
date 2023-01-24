import HeadphonesIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<HeadphonesIcon />', () => {
  it('should render HeadphonesIcon', () => {
    const { container } = renderWithTheme(
      <HeadphonesIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
