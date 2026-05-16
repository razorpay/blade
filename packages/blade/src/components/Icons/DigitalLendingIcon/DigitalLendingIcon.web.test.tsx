import renderWithTheme from '~utils/testing/renderWithTheme.web';

import DigitalLendingIcon from './';

describe('<DigitalLendingIcon />', () => {
  it('should render DigitalLendingIcon', () => {
    const { container } = renderWithTheme(
      <DigitalLendingIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
