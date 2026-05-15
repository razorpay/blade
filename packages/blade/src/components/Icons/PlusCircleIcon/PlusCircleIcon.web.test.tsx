import renderWithTheme from '~utils/testing/renderWithTheme.web';

import PlusCircleIcon from './';

describe('<PlusCircleIcon />', () => {
  it('should render PlusCircleIcon', () => {
    const { container } = renderWithTheme(
      <PlusCircleIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
