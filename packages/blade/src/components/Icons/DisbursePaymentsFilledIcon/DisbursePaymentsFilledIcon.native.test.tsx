import renderWithTheme from '~utils/testing/renderWithTheme.native';

import DisbursePaymentsFilledIcon from '.';

describe('<DisbursePaymentsFilledIcon />', () => {
  it('should render DisbursePaymentsFilledIcon', () => {
    const renderTree = renderWithTheme(
      <DisbursePaymentsFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
