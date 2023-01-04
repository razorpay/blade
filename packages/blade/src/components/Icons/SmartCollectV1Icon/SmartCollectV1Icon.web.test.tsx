import SmartCollectV1Icon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<SmartCollectV1Icon />', () => {
  it('should render SmartCollectV1Icon', () => {
    const { container } = renderWithTheme(
      <SmartCollectV1Icon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
