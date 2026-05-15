import renderWithTheme from '~utils/testing/renderWithTheme.native';

import InternationalPaymentsIcon from '.';

describe('<InternationalPaymentsIcon />', () => {
  it('should render InternationalPaymentsIcon', () => {
    const renderTree = renderWithTheme(
      <InternationalPaymentsIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
