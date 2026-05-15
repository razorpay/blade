import renderWithTheme from '~utils/testing/renderWithTheme.web';

import InstantSettlementIcon from './';

describe('<InstantSettlementIcon />', () => {
  it('should render InstantSettlementIcon', () => {
    const { container } = renderWithTheme(
      <InstantSettlementIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
