import MailOpenIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<MailOpenIcon />', () => {
  it('should render MailOpenIcon', () => {
    const renderTree = renderWithTheme(
      <MailOpenIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
