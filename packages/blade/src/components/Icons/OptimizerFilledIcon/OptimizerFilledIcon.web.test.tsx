import renderWithTheme from '~utils/testing/renderWithTheme.web';

import OptimizerFilledIcon from './';

describe('<OptimizerFilledIcon />', () => {
  it('should render OptimizerFilledIcon', () => {
    const { container } = renderWithTheme(
      <OptimizerFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
