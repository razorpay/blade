import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CopyrightIcon from './';

describe('<CopyrightIcon />', () => {
  it('should render CopyrightIcon', () => {
    const { container } = renderWithTheme(
      <CopyrightIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
