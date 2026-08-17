import React from 'react';
import styled from 'styled-components';
import type { ChatInputFeedbackProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { ChatFeedback } from '~components/ChatFeedback';
import type { ChatFeedbackControls } from '~components/ChatFeedback';
import { Move } from '~components/Move';
import { useTheme } from '~components/BladeProvider';
import { makeSpace } from '~utils';

/**
 * An even 4px inset.
 *
 * Deliberately *not* aligned with the composer's own 16px content padding: the prompt sits closer
 * to the edge of the surface than the placeholder below it does, which is what stops the two rows
 * reading as one list and keeps the prompt feeling like a header on the card rather than a line
 * inside it. The mood buttons are 32px tall and already give the row its height, so anything more
 * than this is air.
 */
const StripPadding = styled(BaseBox)(({ theme }) => ({
  padding: makeSpace(theme.spacing[2]),
  // A touch more on the left, so the question clears the surface's rounded corner rather than
  // sitting tight against it. The right stays at 4px — the submit control needs no such relief.
  paddingLeft: makeSpace(theme.spacing[3]),
}));

/**
 * The feedback prompt attached to the top of a `ChatInput`.
 *
 * ## Why this lives inside `ChatInput` rather than beside it
 *
 * The obvious composition — render `ChatFeedback` above a `ChatInput` — is subtly broken, and
 * silently so. `ChatInput` reserves its validation region as an absolutely positioned box
 * *above* the card (`bottom: calc(100% - 12px)`, full width) and leaves it mounted when there is
 * no error. Anything a consumer stacks in that space is overlapped by an invisible sibling that
 * still takes pointer events: measured against the mood row, it covered the lower 20px of the
 * 32px faces, so hover fired late and a click near the middle of a face — the obvious place to
 * aim — did nothing at all. Nothing about that is discoverable from the outside; the row simply
 * feels dead.
 *
 * Owning the strip here settles it once. The layer it sits on is decided in the same file as the
 * layer the error slot sits on, so the two cannot be composed into conflict.
 *
 * ## Holding the composer still
 *
 * The strip sits directly on top of the composer, so a step one pixel taller pushes the whole
 * composer down — at the exact moment the merchant is reading the strip. The content is held to
 * the height of the mood row (`spacing[8]`, the height of Blade's own mood button) so every step
 * occupies the same space and the swap changes *what* is on the strip and nothing else.
 */
const ChatInputFeedback = ({
  isVisible = true,
  moodIcons,
  question,
  moodConfig,
  isDisabled,
  onMoodSelect,
  onSubmit,
  onDismiss,
  onTagsChange,
  isSubmitHidden,
  comment,
  controlsRef,
}: ChatInputFeedbackProps & {
  onTagsChange?: ({ tags }: { tags: string[] }) => void;
  /** Hides the strip's own tick while the composer is the submit. */
  isSubmitHidden?: boolean;
  /** Free text collected by the composer, folded into the payload on submit. */
  comment?: string;
  /** Lets the composer drive this flow — submit it, and release the tag on the way out. */
  controlsRef?: React.MutableRefObject<ChatFeedbackControls | null>;
}): React.ReactElement => {
  const { theme } = useTheme();

  /*
   * A fresh `Move` per showing.
   *
   * `Move` keeps its own visible/hidden variant state, so a strip that is hidden and later shown
   * again — exactly what finishing a flow and starting another one does — comes back parked on
   * the hidden variant: mounted, laid out, and fully transparent. A frame with nothing in it.
   * Keying on a generation that advances each time it is shown means a new showing can never
   * inherit the last one's animation state.
   */
  const generation = React.useRef(0);
  const wasVisible = React.useRef(isVisible);
  if (isVisible && !wasVisible.current) generation.current += 1;
  wasVisible.current = isVisible;

  return (
    <Move key={generation.current} isVisible={isVisible} shouldUnmountWhenHidden type="inout">
      {/*
        Claims a layer of its own. The error slot below sits at `zIndex: 0` and the input card at
        `zIndex: 1`; the strip joins the card rather than the slot, which is what keeps its
        controls reachable while an error is mounted but not shown.
      */}
      <StripPadding position="relative" zIndex={1}>
        <BaseBox display="flex" alignItems="center" minHeight={makeSpace(theme.spacing[8])}>
          <ChatFeedback
            question={question}
            moodIcons={moodIcons}
            moodConfig={moodConfig}
            isDisabled={isDisabled}
            onMoodSelect={onMoodSelect}
            onTagsChange={onTagsChange}
            isSubmitHidden={isSubmitHidden}
            controlsRef={controlsRef}
            onSubmit={(payload) =>
              onSubmit?.({
                /*
                 * A blank composer is not a comment. Trimmed rather than passed through, so
                 * whitespace does not arrive as feedback someone has to read.
                 */
                ...payload,
                comment: comment?.trim() ? comment.trim() : payload.comment,
              })
            }
            onDismiss={onDismiss}
            /*
             * The strip spans the composer, so each step spreads to the full width and the
             * trailing control lands above the send button. This is the case `isFullWidth` was
             * added for; the floating bar is the one that opts out.
             */
            isFullWidth
          />
        </BaseBox>
      </StripPadding>
    </Move>
  );
};

export { ChatInputFeedback };
