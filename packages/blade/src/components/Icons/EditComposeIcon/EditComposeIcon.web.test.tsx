import renderWithTheme from '~utils/testing/renderWithTheme.web';

import EditComposeIcon from './';

describe('<EditComposeIcon />', () => {
  it('should render EditComposeIcon', () => {
    const { container } = renderWithTheme(
      <EditComposeIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
