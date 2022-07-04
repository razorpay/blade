import ChevronUpIcon from './ChevronUpIcon';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<ChevronUpIcon />', () => {
  it('should render ChevronUpIcon', () => {
    const { container } = renderWithTheme(
      <ChevronUpIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
