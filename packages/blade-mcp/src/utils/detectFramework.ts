import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import type { BladeFramework } from '../types/framework.js';
import { DEFAULT_FRAMEWORK } from '../types/framework.js';

const BLADE_SVELTE_PACKAGE = '@razorpay/blade-svelte';
const BLADE_REACT_PACKAGE = '@razorpay/blade';

export function detectFrameworkFromProject(currentProjectRootDirectory?: string): BladeFramework {
  if (!currentProjectRootDirectory) {
    return DEFAULT_FRAMEWORK;
  }

  const packageJsonPath = join(currentProjectRootDirectory, 'package.json');

  try {
    if (!existsSync(packageJsonPath)) {
      return DEFAULT_FRAMEWORK;
    }

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      peerDependencies?: Record<string, string>;
    };

    const allDependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
      ...packageJson.peerDependencies,
    };

    if (BLADE_SVELTE_PACKAGE in allDependencies) {
      return 'svelte';
    }

    if (BLADE_REACT_PACKAGE in allDependencies) {
      return 'react';
    }

    return DEFAULT_FRAMEWORK;
  } catch {
    return DEFAULT_FRAMEWORK;
  }
}
