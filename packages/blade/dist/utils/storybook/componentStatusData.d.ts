type ComponentStatuses = 'released' | 'in-api-spec' | 'in-development' | 'in-design' | 'deprecated' | 'to-be-decided' | `planned-Q${1 | 2 | 3 | 4}-${'dev' | 'design'}`;
type ComponentStatusDataType = {
    name: string;
    status: ComponentStatuses;
    description: string;
    releasedIn?: string;
    storybookLink?: string;
    platform?: 'web' | 'mobile' | 'all';
}[];
declare const componentData: ComponentStatusDataType;
export type { ComponentStatuses, ComponentStatusDataType };
export { componentData };
