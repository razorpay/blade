import renderWithTheme from '~utils/testing/renderWithTheme.web';

import WorldwideIcon from './';

describe('<WorldwideIcon />', () => {
  it('should render WorldwideIcon', () => {
    const { container } = renderWithTheme(
      <WorldwideIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
