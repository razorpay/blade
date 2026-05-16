import renderWithTheme from '~utils/testing/renderWithTheme.web';

import DigitalLendingFilledIcon from './';

describe('<DigitalLendingFilledIcon />', () => {
  it('should render DigitalLendingFilledIcon', () => {
    const { container } = renderWithTheme(
      <DigitalLendingFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
