import { default as React } from 'react';
import { CodeViewerProps } from '@codesandbox/sandpack-react';
import { RecipeSandboxProps, SandboxProps } from '../types';
declare const SandboxHighlighter: ({ children, theme, ...sandpackCodeViewerProps }: {
    children: string;
    theme?: "dark" | "light" | undefined;
} & CodeViewerProps) => JSX.Element;
declare const SandboxProvider: ({ code, children, language, border, }: Omit<SandboxProps, "children"> & {
    code: string;
    children: React.ReactNode;
    border?: string | undefined;
}) => JSX.Element;
declare function Sandbox({ children, language, showConsole, editorHeight, editorWidthPercentage, padding, }: SandboxProps): JSX.Element;
/**
 * Direct Embed of the Codesandbox as iframe. To be used in recipes.
 *
 * Use `Sandbox` component instead for embedding example of particular component.
 */
declare const RecipeSandbox: (props: RecipeSandboxProps) => JSX.Element;
declare const VerticalSandbox: ({ code, minHeight, }: {
    code: string;
    minHeight?: string | undefined;
}) => JSX.Element;
export { Sandbox, VerticalSandbox, SandboxProvider, SandboxHighlighter, RecipeSandbox };
