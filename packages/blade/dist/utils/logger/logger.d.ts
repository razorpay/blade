type LogType = 'error' | 'warn' | 'log';
type LoggerOptions = {
    message: string;
    moduleName?: string;
    type: LogType;
};
type ThrowBladeErrorOptions = {
    message: string;
    moduleName?: string;
};
declare const throwBladeError: ({ message, moduleName }: ThrowBladeErrorOptions) => void | never;
declare const logger: ({ message, moduleName, type }: LoggerOptions) => void;
export { throwBladeError, logger };
