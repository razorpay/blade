import renderWithTheme from '~utils/testing/renderWithTheme.web';

import RadioIcon from './';

describe('<RadioIcon />', () => {
  it('should render RadioIcon', () => {
    const { container } = renderWithTheme(
      <RadioIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
