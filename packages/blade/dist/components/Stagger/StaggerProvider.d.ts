import { default as React } from 'react';
import { BaseMotionBoxProps } from '../BaseMotion';
type StaggerContextType = {
    isInsideStaggerContainer: boolean;
    staggerType: BaseMotionBoxProps['type'];
};
declare const StaggerContext: React.Context<StaggerContextType>;
declare const useStagger: () => StaggerContextType;
export { useStagger, StaggerContext };
