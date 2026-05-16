import renderWithTheme from '~utils/testing/renderWithTheme.native';

import HeadphoneIcon from '.';

describe('<HeadphoneIcon />', () => {
  it('should render HeadphoneIcon', () => {
    const renderTree = renderWithTheme(
      <HeadphoneIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
