import React from 'react';
import { Text } from 'react-native';

const MenuTrigger = (_props: Record<string, unknown>): React.ReactElement => (
  <Text>MenuTrigger is not available on native</Text>
);

const navMenuItems: never[] = [];

const CustomMenuItem = (_props: Record<string, unknown>): React.ReactElement => (
  <Text>CustomMenuItem is not available on native</Text>
);

const CustomMenuTrigger = (_props: Record<string, unknown>): React.ReactElement => (
  <Text>CustomMenuTrigger is not available on native</Text>
);

export { MenuTrigger, navMenuItems, CustomMenuItem, CustomMenuTrigger };
