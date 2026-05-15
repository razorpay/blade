import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ReticleIcon from './';

describe('<ReticleIcon />', () => {
  it('should render ReticleIcon', () => {
    const { container } = renderWithTheme(
      <ReticleIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
