import type { DrawerComponent } from './styles';
import DrawerImpl from './Drawer.svelte';

export { DRAWER_AXES } from './styles';
export type { DrawerStyleProps, DrawerBehaviourProps, DrawerComponent } from './styles';

export const Drawer: DrawerComponent = DrawerImpl;
