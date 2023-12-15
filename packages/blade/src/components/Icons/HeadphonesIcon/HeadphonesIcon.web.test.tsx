import HeadphonesIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<HeadphonesIcon />', () => {
  it('should render HeadphonesIcon', () => {
    const { container } = renderWithTheme(
      <HeadphonesIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
