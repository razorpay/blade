import renderWithTheme from '~utils/testing/renderWithTheme.native';

import AffordabilityFilledIcon from '.';

describe('<AffordabilityFilledIcon />', () => {
  it('should render AffordabilityFilledIcon', () => {
    const renderTree = renderWithTheme(
      <AffordabilityFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
