import ListChecksIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ListChecksIcon />', () => {
  it('should render ListChecksIcon', () => {
    const { container } = renderWithTheme(
      <ListChecksIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
