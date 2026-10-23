import type { PopoverComponent } from './styles';
import PopoverImpl from './Popover.svelte';

export { POPOVER_AXES } from './styles';
export type { PopoverStyleProps, PopoverBehaviourProps, PopoverComponent } from './styles';

export const Popover: PopoverComponent = PopoverImpl;
