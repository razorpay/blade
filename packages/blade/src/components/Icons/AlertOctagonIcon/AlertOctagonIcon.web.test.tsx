import AlertOctagonIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<AlertOctagonIcon />', () => {
  it('should render AlertOctagonIcon', () => {
    const { container } = renderWithTheme(
      <AlertOctagonIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
