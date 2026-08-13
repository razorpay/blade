import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { detectFrameworkFromProject } from '../detectFramework.js';

describe('detectFrameworkFromProject', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = join(tmpdir(), `blade-mcp-detect-framework-${Date.now()}`);
    mkdirSync(tempDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  const writePackageJson = (content: Record<string, unknown>): void => {
    writeFileSync(join(tempDir, 'package.json'), JSON.stringify(content));
  };

  it('returns svelte when @razorpay/blade-svelte is a dependency', () => {
    writePackageJson({
      dependencies: { '@razorpay/blade-svelte': '^1.0.0' },
    });

    expect(detectFrameworkFromProject(tempDir)).toBe('svelte');
  });

  it('returns react when @razorpay/blade is a dependency', () => {
    writePackageJson({
      dependencies: { '@razorpay/blade': '^12.0.0' },
    });

    expect(detectFrameworkFromProject(tempDir)).toBe('react');
  });

  it('prefers svelte when both blade packages are present', () => {
    writePackageJson({
      dependencies: {
        '@razorpay/blade': '^12.0.0',
        '@razorpay/blade-svelte': '^1.0.0',
      },
    });

    expect(detectFrameworkFromProject(tempDir)).toBe('svelte');
  });

  it('returns react when neither blade package is present', () => {
    writePackageJson({
      dependencies: { react: '^18.0.0' },
    });

    expect(detectFrameworkFromProject(tempDir)).toBe('react');
  });

  it('returns react when package.json is missing', () => {
    expect(detectFrameworkFromProject(tempDir)).toBe('react');
  });

  it('returns react when package.json contains invalid JSON', () => {
    writeFileSync(join(tempDir, 'package.json'), '{ invalid json');

    expect(detectFrameworkFromProject(tempDir)).toBe('react');
  });

  it('detects blade-svelte from devDependencies', () => {
    writePackageJson({
      devDependencies: { '@razorpay/blade-svelte': '^1.0.0' },
    });

    expect(detectFrameworkFromProject(tempDir)).toBe('svelte');
  });

  it('returns react when currentProjectRootDirectory is undefined', () => {
    expect(detectFrameworkFromProject(undefined)).toBe('react');
  });
});
