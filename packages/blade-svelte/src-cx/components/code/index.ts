import type { CodeComponent } from '../shared/typography';
import CodeImpl from './Code.svelte';

export { CODE_AXES, resolveCode } from '../shared/typography';
export type {
  CodeStyleProps,
  CodeBehaviourProps,
  CodeClasses,
  CodeComponent,
} from '../shared/typography';

export const Code: CodeComponent = CodeImpl;
