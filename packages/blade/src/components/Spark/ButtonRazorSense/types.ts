type ButtonRazorSenseProps = {
  isEnabled: boolean;
  /** whether its hover is running (mounted, motion allowed, WebGL2): until then the button keeps its own hover */
  onLiveChange?: (isLive: boolean) => void;
};

export type { ButtonRazorSenseProps };
