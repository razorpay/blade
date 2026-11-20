import { screen } from '@testing-library/react';
import type { PreviewProps } from '../types';
import { Preview, PreviewBody, PreviewFooter, PreviewHeader } from '../Preview.web';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Text } from '~components/Typography';

describe('<PreviewWindow/>', () => {
  it('should render preview window correctly', () => {
    const { container } = renderWithTheme(
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
    const { container } = renderWithTheme(
      <Preview>
        <PreviewHeader />
        <PreviewBody>
          <Text>This is a demo message</Text>
        </PreviewBody>
      </Preview>,
    );
    expect(container).toMatchSnapshot();
  });

  describe('PreviewBody isFullSize', () => {
    const getBodyBox = (): HTMLElement => {
      const body = screen.getByText('This is a demo message').parentElement;
      if (!body) throw new Error('PreviewBody box not found');
      return body;
    };

    it('should not size the body by default, so a full-size image keeps its shape', () => {
      renderWithTheme(
        <Preview>
          <PreviewBody>
            <img width="100%" height="100%" src="image.png" alt="Invoice" />
          </PreviewBody>
        </Preview>,
      );
      // jsdom has no layout, so assert the cause instead of the rendered size: an unsized body
      // leaves the image's `height="100%"` unresolved, so it keeps its own aspect ratio
      // instead of stretching to the frame's shape
      const body = screen.getByRole('img', { name: 'Invoice' }).parentElement;
      expect(body).not.toHaveStyle({ height: '100%' });
      expect(body).not.toHaveStyle({ width: '100%' });
    });

    it('should fill the frame and centre its child when isFullSize is set', () => {
      renderWithTheme(
        <Preview>
          <PreviewBody isFullSize={true}>
            <Text>This is a demo message</Text>
          </PreviewBody>
        </Preview>,
      );
      expect(getBodyBox()).toHaveStyle({
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      });
    });
  });

  describe('zoom limits', () => {
    const renderPreview = (
      props: Omit<PreviewProps, 'children'>,
      showZoomPercentage: boolean,
    ): void => {
      renderWithTheme(
        <Preview {...props}>
          <PreviewBody>
            <Text>This is a demo message</Text>
          </PreviewBody>
          <PreviewFooter showZoomPercentage={showZoomPercentage} />
        </Preview>,
      );
    };

    const zoomInButton = (): HTMLElement => screen.getByRole('button', { name: 'Zoom In' });
    const zoomOutButton = (): HTMLElement => screen.getByRole('button', { name: 'Zoom Out' });

    it('should start at maxZoom when defaultZoom is above it', () => {
      renderPreview({ defaultZoom: 4, maxZoom: 3 }, true);
      expect(screen.getByText('300%')).toBeInTheDocument();
      expect(zoomInButton()).toBeDisabled();
    });

    it('should start at minZoom when the default zoom of 1 is below it', () => {
      renderPreview({ minZoom: 2 }, true);
      expect(screen.getByText('200%')).toBeInTheDocument();
      expect(zoomOutButton()).toBeDisabled();
    });

    describe.each([
      ['with zoom percentage', true],
      ['with button group', false],
    ])('footer %s', (_layoutName, showZoomPercentage) => {
      it('should disable Zoom Out when zoom is at minZoom', () => {
        renderPreview({ defaultZoom: 1, minZoom: 1 }, showZoomPercentage);
        expect(zoomOutButton()).toBeDisabled();
        expect(zoomInButton()).toBeEnabled();
      });

      it('should disable Zoom In when zoom is at maxZoom', () => {
        renderPreview({ defaultZoom: 2, maxZoom: 2 }, showZoomPercentage);
        expect(zoomInButton()).toBeDisabled();
        expect(zoomOutButton()).toBeEnabled();
      });

      it('should keep both zoom buttons enabled between the default limits', () => {
        renderPreview({ defaultZoom: 1 }, showZoomPercentage);
        expect(zoomInButton()).toBeEnabled();
        expect(zoomOutButton()).toBeEnabled();
      });

      it('should disable Zoom Out at the default minZoom of 0.1', () => {
        renderPreview({ defaultZoom: 0.1 }, showZoomPercentage);
        expect(zoomOutButton()).toBeDisabled();
      });

      it('should disable Zoom In at the default maxZoom of 8', () => {
        renderPreview({ defaultZoom: 8 }, showZoomPercentage);
        expect(zoomInButton()).toBeDisabled();
      });
    });
  });
});
