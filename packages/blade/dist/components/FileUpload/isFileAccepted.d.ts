import { BladeFile } from './types';
/**
 * Check if the provided file type should be accepted by the input with accept attribute.
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input#attr-accept
 *
 * Inspired by https://github.com/enyo/dropzone
 */
declare const isFileAccepted: (file: BladeFile, acceptedFiles: string) => boolean;
export { isFileAccepted };
