import RoutesV1Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<RoutesV1Icon />', () => {
  it('should render RoutesV1Icon', () => {
    const renderTree = renderWithTheme(
      <RoutesV1Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
