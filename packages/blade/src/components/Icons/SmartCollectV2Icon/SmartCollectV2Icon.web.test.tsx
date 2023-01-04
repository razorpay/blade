import SmartCollectV2Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<SmartCollectV2Icon />', () => {
  it('should render SmartCollectV2Icon', () => {
    const { container } = renderWithTheme(
      <SmartCollectV2Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
