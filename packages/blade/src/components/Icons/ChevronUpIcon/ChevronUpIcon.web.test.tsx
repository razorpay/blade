import renderWithTheme from '../../../_helpers/testing/renderWithTheme.web';
import ChevronUpIcon from '.';

describe('<ChevronUpIcon />', () => {
  it('should render ChevronUpIcon', () => {
    const { container } = renderWithTheme(
      <ChevronUpIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
