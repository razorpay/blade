import { TextInput } from '../';
import { InfoIcon } from '~components/Icons';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<TextInput />', () => {
  it('should render TextInput', () => {
    const { container } = renderWithSSR(
      <TextInput
        label="Enter company website"
        type="url"
        placeholder="something"
        icon={InfoIcon}
        prefix="https://"
        suffix=".com"
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
