import renderWithTheme from '../../../_helpers/testing/renderWithTheme.web';
import TrashIcon from '.';

describe('<TrashIcon />', () => {
  it('should render TrashIcon', () => {
    const { container } = renderWithTheme(
      <TrashIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
