import React from 'react';
import userEvents from '@testing-library/user-event';
import { fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import { LightBox, LightBoxBody, LightBoxItem } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

beforeAll(() => {
  Object.defineProperty(window.Element.prototype, 'scroll', {
    writable: true,
    value: jest.fn(),
  });
});

afterAll(() => {
  Object.defineProperty(window.Element.prototype, 'scroll', {
    writable: true,
    value: undefined,
  });
});

const BasicLightBox = ({
  isOpen = true,
  onDismiss = jest.fn(),
  activeIndex,
  defaultActiveIndex,
  onIndexChange,
  accessibilityLabel,
}: {
  isOpen?: boolean;
  onDismiss?: () => void;
  activeIndex?: number;
  defaultActiveIndex?: number;
  onIndexChange?: (value: { index: number }) => void;
  accessibilityLabel?: string;
}): React.ReactElement => (
  <LightBox
    isOpen={isOpen}
    onDismiss={onDismiss}
    activeIndex={activeIndex}
    defaultActiveIndex={defaultActiveIndex}
    onIndexChange={onIndexChange}
    accessibilityLabel={accessibilityLabel}
  >
    <LightBoxBody>
      <LightBoxItem src="https://picsum.photos/seed/lightbox-1/1200/800" alt="Document 1" />
      <LightBoxItem src="https://picsum.photos/seed/lightbox-2/1200/800" alt="Document 2" />
      <LightBoxItem
        thumbnail="https://picsum.photos/seed/lightbox-custom-thumb/300/200"
        alt="Video File"
      >
        <div>Custom content slide</div>
      </LightBoxItem>
    </LightBoxBody>
  </LightBox>
);

describe('<LightBox />', () => {
  it('should render dialog with default accessibility label', () => {
    const { getByRole } = renderWithTheme(<BasicLightBox />);
    expect(getByRole('dialog', { name: 'Media viewer' })).toBeInTheDocument();
  });

  it('should render dialog with custom accessibility label', () => {
    const { getByRole } = renderWithTheme(<BasicLightBox accessibilityLabel="Document gallery" />);
    expect(getByRole('dialog', { name: 'Document gallery' })).toBeInTheDocument();
  });

  it('should dismiss on overlay click', async () => {
    const user = userEvents.setup();
    const onDismiss = jest.fn();
    const { getByRole } = renderWithTheme(<BasicLightBox onDismiss={onDismiss} />);

    await user.click(getByRole('dialog'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('should dismiss on close button click', async () => {
    const user = userEvents.setup();
    const onDismiss = jest.fn();
    const { getByRole } = renderWithTheme(<BasicLightBox onDismiss={onDismiss} />);

    await user.click(getByRole('button', { name: 'Close lightbox' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('should close in controlled mode on close button click', async () => {
    const user = userEvents.setup();
    // In controlled mode, consumer closes LightBox on dismiss callback.
    const ControlledWrapper = (): React.ReactElement => {
      const [isOpen, setIsOpen] = React.useState(true);
      return <BasicLightBox isOpen={isOpen} onDismiss={() => setIsOpen(false)} />;
    };

    const controlled = renderWithTheme(<ControlledWrapper />);
    await user.click(controlled.getByRole('button', { name: 'Close lightbox' }));
    await waitForElementToBeRemoved(() => controlled.queryByRole('dialog'));
    expect(controlled.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should dismiss on escape key press', () => {
    const onDismiss = jest.fn();
    const { getByRole } = renderWithTheme(<BasicLightBox onDismiss={onDismiss} />);
    fireEvent.keyDown(getByRole('dialog'), { key: 'Escape' });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('should call onIndexChange when a thumbnail is clicked', async () => {
    const user = userEvents.setup();
    const onIndexChange = jest.fn();
    const { getByRole } = renderWithTheme(<BasicLightBox onIndexChange={onIndexChange} />);

    await user.click(getByRole('button', { name: 'Document 2' }));
    expect(onIndexChange).toHaveBeenCalledWith({ index: 1 });
  });

  it('should render custom content item in main view when active', () => {
    const { getByText } = renderWithTheme(<BasicLightBox defaultActiveIndex={2} />);
    expect(getByText('Custom content slide')).toBeInTheDocument();
  });

  it('should render image gallery snapshot', () => {
    const { container } = renderWithTheme(
      <LightBox isOpen={true} onDismiss={jest.fn()}>
        <LightBoxBody>
          <LightBoxItem src="https://picsum.photos/seed/lightbox-1/1200/800" alt="Document 1" />
          <LightBoxItem src="https://picsum.photos/seed/lightbox-2/1200/800" alt="Document 2" />
        </LightBoxBody>
      </LightBox>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render mixed content gallery snapshot', () => {
    const { container } = renderWithTheme(<BasicLightBox />);
    expect(container).toMatchSnapshot();
  });

  it('should not have accessibility violations', async () => {
    const { getByRole } = renderWithTheme(<BasicLightBox />);
    await assertAccessible(getByRole('dialog'));
  });
});
