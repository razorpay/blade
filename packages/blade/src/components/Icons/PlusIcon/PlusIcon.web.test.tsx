import renderWithTheme from '../../../_helpers/testing/renderWithTheme.web';
import PlusIcon from '.';

describe('<PlusIcon />', () => {
  it('should render PlusIcon', () => {
    const { container } = renderWithTheme(
      <PlusIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
