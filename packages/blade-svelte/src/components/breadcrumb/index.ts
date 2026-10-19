import type { Component } from 'svelte';
import type { BreadcrumbBehaviourProps, BreadcrumbItemProps, BreadcrumbStyleProps } from './styles';

export * from './styles';
export { default as Breadcrumb } from './Breadcrumb.svelte';
export { default as BreadcrumbItem } from './BreadcrumbItem.svelte';

export type BreadcrumbComponent = Component<BreadcrumbBehaviourProps & BreadcrumbStyleProps>;
export type BreadcrumbItemComponent = Component<BreadcrumbItemProps>;
