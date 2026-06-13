import { SectionSeparator } from '../SectionSeparator';
import { Box } from '~components/Box';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<SectionSeparator />', () => {
  it('should render SectionSeparator on server', () => {
    const { container } = renderWithSSR(
      <Box display="flex">
        <SectionSeparator label="Section Title" />
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });
});
