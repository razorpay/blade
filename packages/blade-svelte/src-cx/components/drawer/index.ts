import type { DrawerComponent } from './styles';
import DrawerImpl from './Drawer.svelte';

export {
  DRAWER_AXES,
  type DrawerStyleProps,
  type DrawerBehaviourProps,
  type DrawerComponent,
} from './styles';

export const Drawer: DrawerComponent = DrawerImpl;
