import renderWithTheme from '~utils/testing/renderWithTheme.web';

import HeadsetIcon from './';

describe('<HeadsetIcon />', () => {
  it('should render HeadsetIcon', () => {
    const { container } = renderWithTheme(
      <HeadsetIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
