import renderWithTheme from '~utils/testing/renderWithTheme.native';

import ArrowLeftIcon from '.';

describe('<ArrowLeftIcon />', () => {
  it('should render ArrowLeftIcon', () => {
    const renderTree = renderWithTheme(
      <ArrowLeftIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
