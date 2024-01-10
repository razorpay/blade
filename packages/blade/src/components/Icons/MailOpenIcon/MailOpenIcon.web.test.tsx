import MailOpenIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<MailOpenIcon />', () => {
  it('should render MailOpenIcon', () => {
    const { container } = renderWithTheme(
      <MailOpenIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
