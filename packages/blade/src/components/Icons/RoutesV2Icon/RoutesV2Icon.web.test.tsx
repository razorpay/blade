import RoutesV2Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<RoutesV2Icon />', () => {
  it('should render RoutesV2Icon', () => {
    const { container } = renderWithTheme(
      <RoutesV2Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
