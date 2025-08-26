import BfsiFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<BfsiFilledIcon />', () => {
  it('should render BfsiFilledIcon', () => {
    const { container } = renderWithTheme(
      <BfsiFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
