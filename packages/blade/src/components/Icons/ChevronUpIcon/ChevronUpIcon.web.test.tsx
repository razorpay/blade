import ChevronUpIcon from './ChevronUpIcon';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ChevronUpIcon />', () => {
  it('should render ChevronUpIcon', () => {
    const { container } = renderWithTheme(
      <ChevronUpIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
