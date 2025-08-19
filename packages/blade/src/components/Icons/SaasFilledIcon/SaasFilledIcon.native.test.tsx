import SaasFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<SaasFilledIcon />', () => {
  it('should render SaasFilledIcon', () => {
    const renderTree = renderWithTheme(
      <SaasFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
