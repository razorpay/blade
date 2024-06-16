import CloudLightningIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CloudLightningIcon />', () => {
  it('should render CloudLightningIcon', () => {
    const renderTree = renderWithTheme(
      <CloudLightningIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
