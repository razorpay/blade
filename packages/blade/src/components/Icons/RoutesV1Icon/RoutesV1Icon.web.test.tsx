import RoutesV1Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<RoutesV1Icon />', () => {
  it('should render RoutesV1Icon', () => {
    const { container } = renderWithTheme(
      <RoutesV1Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
