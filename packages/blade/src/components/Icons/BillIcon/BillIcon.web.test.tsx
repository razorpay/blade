import BillIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<BillIcon />', () => {
  it('should render BillIcon', () => {
    const { container } = renderWithTheme(
      <BillIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
