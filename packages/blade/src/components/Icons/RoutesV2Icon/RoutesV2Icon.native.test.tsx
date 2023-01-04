import RoutesV2Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<RoutesV2Icon />', () => {
  it('should render RoutesV2Icon', () => {
    const renderTree = renderWithTheme(
      <RoutesV2Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
