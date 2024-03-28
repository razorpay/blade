import { ButtonGroup } from '../ButtonGroup';
import { Button } from '~components/Button/Button';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<ButtonGroup />', () => {
  it('should render ButtonGroup', () => {
    const { container } = renderWithSSR(
      <ButtonGroup testID="button-group-test">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>,
    );
    expect(container).toMatchSnapshot();
  });
});
