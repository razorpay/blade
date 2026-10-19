// Card's parts, as Blade React spells them, each over its own classes; the
// classes are exported apart. CardHeader is also the base the overlays'
// headers build on.
export * from './styles';
export { default as CardHeader } from './CardHeader.svelte';
export { default as CardBody } from './CardBody.svelte';
export { default as CardFooter } from './CardFooter.svelte';
