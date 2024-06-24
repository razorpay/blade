/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Platform } from '~utils';

type BladeCommonEvents = {
  onBlur?: Platform.Select<{
    native: undefined | ((event: any) => void);
    web: React.FocusEventHandler;
  }>;
  onFocus?: Platform.Select<{
    native: undefined | ((event: any) => void);
    web: React.FocusEventHandler;
  }>;
  onMouseLeave?: Platform.Select<{ web: React.MouseEventHandler; native: undefined }>;
  onMouseMove?: Platform.Select<{ web: React.MouseEventHandler; native: undefined }>;
  onMouseDown?: Platform.Select<{
    web: React.MouseEventHandler;
    native: undefined | ((event: any) => void);
  }>;
  onMouseUp?: Platform.Select<{
    web: React.MouseEventHandler;
    native: undefined | ((event: any) => void);
  }>;
  onPointerDown?: Platform.Select<{ web: React.PointerEventHandler; native: undefined }>;
  onPointerEnter?: Platform.Select<{ web: React.PointerEventHandler; native: undefined }>;
  onTouchStart?: Platform.Select<{
    native: undefined | ((event: any) => void);
    web: React.TouchEventHandler;
  }>;
  onTouchEnd?: Platform.Select<{
    native: undefined | ((event: any) => void);
    web: React.TouchEventHandler;
  }>;
};

export type { BladeCommonEvents };
