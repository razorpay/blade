import renderWithTheme from '~utils/testing/renderWithTheme.web';

import BuildingIcon from './';

describe('<BuildingIcon />', () => {
  it('should render BuildingIcon', () => {
    const { container } = renderWithTheme(
      <BuildingIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
