import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CloudDrizzleIcon from './';

describe('<CloudDrizzleIcon />', () => {
  it('should render CloudDrizzleIcon', () => {
    const { container } = renderWithTheme(
      <CloudDrizzleIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
