import { BaseBoxProps } from '../../components/Box/BaseBox';
declare const ArgsTable: ({ data, marginBottom, marginTop, }: {
    data: Record<string, string | {
        note: string;
        type: string | JSX.Element;
    } | JSX.Element>;
    marginBottom?: BaseBoxProps['marginBottom'];
    marginTop?: BaseBoxProps['marginTop'];
}) => JSX.Element;
export { ArgsTable };
