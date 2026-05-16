import renderWithTheme from '~utils/testing/renderWithTheme.web';

import RewindIcon from './';

describe('<RewindIcon />', () => {
  it('should render RewindIcon', () => {
    const { container } = renderWithTheme(
      <RewindIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
