import { default as React } from 'react';
type StoryPageWrapperTypes = {
    figmaURL?: string;
    codeUrl?: string;
    argTableComponent?: unknown;
    componentDescription: string;
    propsDescription?: string;
    componentName: string;
    children?: React.ReactNode;
    note?: React.ReactChild;
    showStorybookControls?: boolean;
    showDefaultExample?: boolean;
    showArgsTable?: boolean;
    /**
     * Use this to override default API decision link generated from componentName
     */
    apiDecisionLink?: string | null;
    /**
     * Use this to override default imports
     */
    imports?: string;
    /**
     * Use this to override default API decision component name
     */
    apiDecisionComponentName?: string;
};
declare const StoryPageWrapper: (props: StoryPageWrapperTypes) => React.ReactElement;
export default StoryPageWrapper;
