import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ShuffleIcon from './';

describe('<ShuffleIcon />', () => {
  it('should render ShuffleIcon', () => {
    const { container } = renderWithTheme(
      <ShuffleIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
