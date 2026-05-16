import renderWithTheme from '~utils/testing/renderWithTheme.web';

import RepeatIcon from './';

describe('<RepeatIcon />', () => {
  it('should render RepeatIcon', () => {
    const { container } = renderWithTheme(
      <RepeatIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
