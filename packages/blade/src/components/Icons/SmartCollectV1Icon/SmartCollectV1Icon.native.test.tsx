import SmartCollectV1Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<SmartCollectV1Icon />', () => {
  it('should render SmartCollectV1Icon', () => {
    const renderTree = renderWithTheme(
      <SmartCollectV1Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
