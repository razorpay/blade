import renderWithTheme from '~utils/testing/renderWithTheme.web';

import NoSignalIcon from './';

describe('<NoSignalIcon />', () => {
  it('should render NoSignalIcon', () => {
    const { container } = renderWithTheme(
      <NoSignalIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
