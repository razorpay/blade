export declare const isPR: boolean;
export declare const tsConfigJSON: string;
type Dependencies = {
    dependencies: Record<string, string>;
    devDependencies?: Record<string, string>;
};
export declare const getReactScriptsJSDependencies: () => Dependencies;
export declare const vitePackageJSON: string;
export declare const featuresJS: string;
export declare const viteConfigTS: string;
export declare const indexHTML: string;
export declare const logger: string;
export declare const getIndexTSX: ({ themeTokenName, brandColor, colorScheme, showConsole, }: {
    themeTokenName: any;
    brandColor: any;
    colorScheme: any;
    showConsole?: boolean | undefined;
}) => string;
export {};
