import renderWithTheme from '~utils/testing/renderWithTheme.web';

import LoaderIcon from './';

describe('<LoaderIcon />', () => {
  it('should render LoaderIcon', () => {
    const { container } = renderWithTheme(
      <LoaderIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
