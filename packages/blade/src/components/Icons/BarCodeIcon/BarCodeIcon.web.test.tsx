import renderWithTheme from '~utils/testing/renderWithTheme.web';

import BarCodeIcon from './';

describe('<BarCodeIcon />', () => {
  it('should render BarCodeIcon', () => {
    const { container } = renderWithTheme(
      <BarCodeIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
