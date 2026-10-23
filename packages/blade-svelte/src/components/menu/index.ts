import type { MenuComponent } from './styles';
import MenuImpl from './Menu.svelte';

export type { MenuStyleProps, MenuBehaviourProps, MenuComponent } from './styles';

export const Menu: MenuComponent = MenuImpl;
