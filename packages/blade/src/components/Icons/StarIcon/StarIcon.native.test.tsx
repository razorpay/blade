import renderWithTheme from '~utils/testing/renderWithTheme.native';

import StarIcon from '.';

describe('<StarIcon />', () => {
  it('should render StarIcon', () => {
    const renderTree = renderWithTheme(
      <StarIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
