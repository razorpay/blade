import renderWithTheme from '~utils/testing/renderWithTheme.web';

import AlignRightIcon from './';

describe('<AlignRightIcon />', () => {
  it('should render AlignRightIcon', () => {
    const { container } = renderWithTheme(
      <AlignRightIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
