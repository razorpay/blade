// test case for ChatMessage component
// eslint-disable-next-line blade/no-cross-platform-imports
import { PreviewFooter, Preview, PreviewBody, PreviewHeader } from '../Preview.web';
import renderWithSSR from '~utils/testing/renderWithSSR.web';
import { Text } from '~components/Typography';

describe('<PreviewWindow/>', () => {
  it('should render preview window correctly', () => {
    const { container } = renderWithSSR(
      <Preview>
        <PreviewHeader title="Preview Window" />
        <PreviewBody>
          <Text>This is a demo message</Text>
        </PreviewBody>
        <PreviewFooter showZoomPercentage={true} />
      </Preview>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render preview header without title correctly', () => {
    const { container } = renderWithSSR(
      <Preview>
        <PreviewHeader />
        <PreviewBody>
          <Text>This is a demo message</Text>
        </PreviewBody>
      </Preview>,
    );
    expect(container).toMatchSnapshot();
  });
});
