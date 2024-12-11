import type { BaseMotionEntryExitProps } from '~components/BaseMotion';

type SlideDirections = 'top' | 'right' | 'bottom' | 'left';

type SlideProps = Pick<
  BaseMotionEntryExitProps,
  'children' | 'isVisible' | 'motionTriggers' | 'shouldUnmountWhenHidden' | 'type' | 'delay'
> & {
  /**
   * Direction from where the component should slide
   *
   * ```jsx
   * // Slides from top on enter and slides to top on exit
   * <Slide direction="top"><Component /></Slide>
   *
   * // Slides from right on enter, slides to top on exit
   * <Slide direction={{ enter: 'right', exit: 'top' }}><Component /></Slide>
   * ```
   *
   * @default 'bottom'
   */
  direction?:
    | SlideDirections
    | {
        enter: SlideDirections;
        exit: SlideDirections;
      };

  /**
   * Offset from which the component should slide.
   *
   * Possible values are `100vh`, `100vw`, `${number}%`.
   *
   * The Slide component is only meant to be used to animate something from outside of your viewport.
   * So this prop has limited values to ensure it gives you control on what outside of viewport means in your case yet restrict unintentional usage of moving in something from middle of viewport
   *
   * If you want subtle movement on enter, `Move` is probably the component you're looking for.
   *
   * @default
   * `direction="right | left"` -> 100vw
   * `direction="top | bottom" -> 100vh
   */
  fromOffset?: `100vh` | `100vw` | `${number}%`;
};

export type { SlideProps };
