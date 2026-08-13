import { z } from 'zod';

export type BladeFramework = 'react' | 'svelte';

export const BLADE_FRAMEWORKS: BladeFramework[] = ['react', 'svelte'];

export const DEFAULT_FRAMEWORK: BladeFramework = 'react';

export const frameworkSchema = z.enum(BLADE_FRAMEWORKS).optional();
