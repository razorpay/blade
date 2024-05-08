import BarCodeIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<BarCodeIcon />', () => {
  it('should render BarCodeIcon', () => {
    const { container } = renderWithTheme(
      <BarCodeIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
