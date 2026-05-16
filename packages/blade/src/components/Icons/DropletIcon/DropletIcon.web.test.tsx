import renderWithTheme from '~utils/testing/renderWithTheme.web';

import DropletIcon from './';

describe('<DropletIcon />', () => {
  it('should render DropletIcon', () => {
    const { container } = renderWithTheme(
      <DropletIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
