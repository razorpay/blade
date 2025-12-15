/// <reference types="vite/client" />

import { Theme } from '@razorpay/blade/components';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
