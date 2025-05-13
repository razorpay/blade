import { PreviewWindow, PreviewBody, PreviewFooter, PreviewHeader } from '../PreviewWindow.web';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Text } from '~components/Typography';

describe('<PreviewWindow/>', () => {
  it('should render preview window correctly', () => {
    const { container } = renderWithTheme(
      <PreviewWindow>
        <PreviewHeader title="Preview Window" />
        <PreviewBody>
          <Text>This is a demo message</Text>
        </PreviewBody>
        <PreviewFooter showZoomPercentage={true} />
      </PreviewWindow>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render preview header without title correctly', () => {
    const { container } = renderWithTheme(
      <PreviewWindow>
        <PreviewHeader />
        <PreviewBody>
          <Text>This is a demo message</Text>
        </PreviewBody>
      </PreviewWindow>,
    );
    expect(container).toMatchSnapshot();
  });
});
