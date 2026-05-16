import renderWithTheme from '~utils/testing/renderWithTheme.web';

import StarIcon from './';

describe('<StarIcon />', () => {
  it('should render StarIcon', () => {
    const { container } = renderWithTheme(
      <StarIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
