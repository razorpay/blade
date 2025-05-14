/* eslint-disable @typescript-eslint/no-unused-vars */
type LogType = 'error' | 'warn' | 'log';

type LoggerOptions = {
  message: string;
  moduleName?: string;
  type: LogType;
};

type ExtractKeys<T extends string> = T extends `${infer _Start}{${infer Key}}${infer Rest}`
  ? Key | ExtractKeys<Rest>
  : never;

type ThrowBladeErrorOptions<T extends string, K extends string = ExtractKeys<T>> = {
  message: T;
  moduleName?: string;
} & ([K] extends [never] ? { values?: never } : { values: Record<K, string> });

function interpolateString<T extends string>(
  template: T,
  values: Record<ExtractKeys<T>, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    return key in values ? values[key as ExtractKeys<T>] : `{${key}}`;
  });
}

const PREFIX = '[Blade]:';
const throwBladeError = <T extends string>({
  message,
  moduleName,
  values,
}: ThrowBladeErrorOptions<T>): void | never => {
  if (__DEV__) {
    const prefix = moduleName ? `[Blade: ${moduleName}]:` : PREFIX;
    throw new Error(`${prefix} ${interpolateString(message, values!)}`);
  }
};

const getCommonLogger = (
  type: LogType,
): typeof console.log | typeof console.error | typeof console.warn => {
  switch (type) {
    case 'error':
      return console.error;
    case 'warn':
      return console.warn;
    case 'log':
    default:
      return console.log;
  }
};

const logger = ({ message, moduleName, type }: LoggerOptions): void => {
  if (__DEV__) {
    const prefix = moduleName ? `[Blade: ${moduleName}]:` : PREFIX;
    getCommonLogger(type)(`${prefix} ${message}`);
  }
};

export { throwBladeError, logger };
