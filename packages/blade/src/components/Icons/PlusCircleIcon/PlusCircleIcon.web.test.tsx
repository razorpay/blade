import PlusCircleIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PlusCircleIcon />', () => {
  it('should render PlusCircleIcon', () => {
    const { container } = renderWithTheme(
      <PlusCircleIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
