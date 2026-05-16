import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CutIcon from './';

describe('<CutIcon />', () => {
  it('should render CutIcon', () => {
    const { container } = renderWithTheme(
      <CutIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
