import SmartCollectV2Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<SmartCollectV2Icon />', () => {
  it('should render SmartCollectV2Icon', () => {
    const renderTree = renderWithTheme(
      <SmartCollectV2Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
