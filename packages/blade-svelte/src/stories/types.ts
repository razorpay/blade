import type { Component } from 'svelte';

/** Story args are the JSON-serializable knobs the controls panel edits. */
export type ArgValue = string | number | boolean;
export type Args = Record<string, ArgValue | undefined>;

export type ControlKind = 'boolean' | 'text' | 'number' | 'select';

export interface ArgType {
  control: ControlKind;
  options?: readonly string[];
  description?: string;
}

export type ArgTypes = Record<string, ArgType>;

/** One story: keyed by the `.svelte` file beside the group's `index.ts`. */
export interface StoryDef {
  name?: string;
  description?: string;
  args?: Args;
  /** Replaces the group's argTypes for this story. */
  argTypes?: ArgTypes;
}

/** A story group's `index.ts` default export (CSF-shaped). */
export interface StoryMeta {
  title: string;
  description?: string;
  argTypes?: ArgTypes;
  stories: Record<string, StoryDef>;
}

export type StoryComponent = Component<{ args: Args }>;

export interface StoryEntry {
  /** `<dir>/<File>`, the routable id. */
  id: string;
  dir: string;
  file: string;
  name: string;
  meta: StoryMeta;
  def: StoryDef;
}

export interface StoryGroup {
  dir: string;
  title: string;
  entries: StoryEntry[];
}

export interface ControlSpec extends ArgType {
  name: string;
}

export type ViewportName = 'fill' | 'mobile' | 'desktop';

export interface ThemeSettings {
  primary: string;
  /** Empty derives the surface from the primary colour, as checkout does. */
  surface: string;
  cta: string;
  icon: string;
  sharp: boolean;
  fontSize: number;
}

export type PanelName = 'controls' | 'source' | 'docs' | 'a11y' | 'theme';

export interface DocsLocation {
  storyId: string | null;
  args: Args;
  theme: Partial<ThemeSettings>;
  viewport: ViewportName;
  panel: PanelName;
}

export interface A11yViolation {
  id: string;
  impact: string;
  help: string;
  helpUrl: string;
  targets: string[];
}

export interface A11yReport {
  violations: A11yViolation[];
  passes: number;
}

export type PreviewMessage =
  | { type: 'ready'; storyId: string | null }
  | { type: 'error'; message: string }
  | { type: 'a11y'; report: A11yReport };

export type ManagerMessage = { type: 'run-a11y' };
