import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CheckIcon from '.';

describe('<CheckIcon />', () => {
  it('should render CheckIcon', () => {
    const renderTree = renderWithTheme(
      <CheckIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
