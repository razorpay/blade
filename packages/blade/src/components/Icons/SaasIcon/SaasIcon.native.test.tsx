import renderWithTheme from '~utils/testing/renderWithTheme.native';

import SaasIcon from '.';

describe('<SaasIcon />', () => {
  it('should render SaasIcon', () => {
    const renderTree = renderWithTheme(
      <SaasIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
