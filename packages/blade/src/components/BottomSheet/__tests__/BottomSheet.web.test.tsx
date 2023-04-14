/* eslint-disable no-global-assign */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import userEvents from '@testing-library/user-event';
import { createEvent, fireEvent, waitFor } from '@testing-library/react';
import { mockViewport } from 'jsdom-testing-mocks';
import { BottomSheet, BottomSheetHeader, BottomSheetBody, BottomSheetFooter } from '../BottomSheet';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';
import { Text } from '~components/Typography';
import { Button } from '~components/Button';

// from: https://github.com/pmndrs/use-gesture/blob/main/test/utils.tsx
function patchCreateEvent(createEvent: any): void {
  // patching createEvent
  for (const key in createEvent) {
    if (key.startsWith('pointer')) {
      const fn = createEvent[key.replace('pointer', 'mouse')];
      if (!fn) continue;
      // eslint-disable-next-line func-names
      createEvent[key] = function (
        type: unknown,
        { pointerId = 1, pointerType = 'mouse', ...rest } = {},
      ) {
        const event = fn(type, rest);
        event.pointerId = pointerId;
        event.pointerType = pointerType;
        const eventType = event.type;
        Object.defineProperty(event, 'type', {
          get: () => {
            return eventType.replace('mouse', 'pointer');
          },
        });
        return event;
      };
    }
  }
}

patchCreateEvent(createEvent);

describe('<BottomSheet />', () => {
  const viewport = mockViewport({ width: '320px', height: '568px' });

  it('should open/close BottomSheet', async () => {
    const user = userEvents.setup();

    const Example = (): React.ReactElement => {
      const sheet = React.useRef();

      return (
        <>
          <Button onClick={() => sheet?.current.open()}>Open</Button>
          <BottomSheet ref={sheet}>
            <BottomSheetHeader title="Select Account" />
            <BottomSheetBody>
              {new Array(50).fill(0).map((_, idx) => (
                <Text key={idx}>BottomSheet body {idx}</Text>
              ))}
            </BottomSheetBody>
            <BottomSheetFooter
              title="Footer Title"
              trailing={{
                primary: { text: 'Apply' },
                secondary: { text: 'Cancel' },
              }}
            />
          </BottomSheet>
        </>
      );
    };
    const { getByText, getByTestId } = renderWithTheme(<Example />);

    expect(getByTestId('bottomsheet-body')).not.toBeVisible();
    await user.click(getByText(/open/i));
    expect(getByTestId('bottomsheet-body')).toBeVisible();
    await user.click(getByTestId('bottomsheet-backdrop'));
    expect(getByTestId('bottomsheet-body')).not.toBeVisible();
  });

  it('should close with gestures', async () => {
    const user = userEvents.setup();

    const Example = (): React.ReactElement => {
      const sheet = React.useRef();

      return (
        <>
          <Button onClick={() => sheet?.current.open()}>Open</Button>
          <BottomSheet ref={sheet}>
            <BottomSheetHeader title="Select Account" />
            <BottomSheetBody>
              {new Array(50).fill(0).map((_, idx) => (
                <Text key={idx}>BottomSheet body {idx}</Text>
              ))}
            </BottomSheetBody>
            <BottomSheetFooter
              title="Footer Title"
              trailing={{
                primary: { text: 'Apply' },
                secondary: { text: 'Cancel' },
              }}
            />
          </BottomSheet>
        </>
      );
    };

    const { getByText, getByTestId } = renderWithTheme(<Example />);

    expect(getByTestId('bottomsheet-body')).not.toBeVisible();
    await user.click(getByText(/open/i));
    expect(getByTestId('bottomsheet-body')).toBeVisible();
    // drag down
    fireEvent.pointerDown(getByTestId('bottomsheet-body'), {
      pointerId: 4,
      clientX: 50,
      clientY: 20,
    });
    fireEvent.pointerMove(getByTestId('bottomsheet-body'), {
      pointerId: 4,
      clientX: 50,
      clientY: 50,
    });

    await waitFor(() => {
      expect(getByTestId('bottomsheet-body')).not.toBeVisible();
    });
  });

  viewport.cleanup();
});
