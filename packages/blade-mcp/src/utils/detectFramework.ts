import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import type { BladeFramework } from '../types/framework.js';
import { DEFAULT_FRAMEWORK } from '../types/framework.js';

const BLADE_SVELTE_PACKAGE = '@razorpay/blade-svelte';
const BLADE_REACT_PACKAGE = '@razorpay/blade';

export function detectFrameworkFromProject(currentProjectRootDirectory?: string): BladeFramework {
  if (!currentProjectRootDirectory) {
    console.warn(
      `[blade-mcp] Framework auto-detection: no project root provided, defaulting to "${DEFAULT_FRAMEWORK}". Pass framework explicitly to avoid incorrect docs.`,
    );
    return DEFAULT_FRAMEWORK;
  }

  const packageJsonPath = join(currentProjectRootDirectory, 'package.json');

  try {
    if (!existsSync(packageJsonPath)) {
      console.warn(
        `[blade-mcp] Framework auto-detection: package.json not found at ${packageJsonPath}, defaulting to "${DEFAULT_FRAMEWORK}". Pass framework explicitly to avoid incorrect docs.`,
      );
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

    console.warn(
      `[blade-mcp] Framework auto-detection: neither ${BLADE_SVELTE_PACKAGE} nor ${BLADE_REACT_PACKAGE} found in dependencies, defaulting to "${DEFAULT_FRAMEWORK}". Pass framework explicitly to avoid incorrect docs.`,
    );
    return DEFAULT_FRAMEWORK;
  } catch (error) {
    console.warn(
      `[blade-mcp] Framework auto-detection: failed to parse package.json (${error}), defaulting to "${DEFAULT_FRAMEWORK}". Pass framework explicitly to avoid incorrect docs.`,
    );
    return DEFAULT_FRAMEWORK;
  }
}
