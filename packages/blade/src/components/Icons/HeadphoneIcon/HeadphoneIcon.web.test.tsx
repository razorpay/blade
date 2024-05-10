import HeadphoneIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<HeadphoneIcon />', () => {
  it('should render HeadphoneIcon', () => {
    const { container } = renderWithTheme(
      <HeadphoneIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
