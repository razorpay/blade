import renderWithTheme from '~utils/testing/renderWithTheme.web';

import RupeesIcon from './';

describe('<RupeesIcon />', () => {
  it('should render RupeesIcon', () => {
    const { container } = renderWithTheme(
      <RupeesIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
