import { MotionMetaProp } from '../BaseMotion';
import { Theme } from '../BladeProvider';
import { StyledPropsBlade } from '../Box/styledProps';
import { DotNotationToken } from '../../utils/lodashButBetter/get';
import { DataAnalyticsAttribute } from '../../utils/types';
import { BoxProps } from '../Box';
interface BladeFile extends File {
    /**
     * The unique identifier of the file.
     */
    id?: string;
    /**
     * The file's upload status.
     */
    status?: 'uploading' | 'success' | 'error';
    /**
     * The percentage of file upload completion.
     */
    uploadPercent?: number;
    /**
     * Text indicating an error state
     */
    errorText?: string;
}
type BladeFileList = BladeFile[];
type FileUploadCommonProps = {
    /**
     * Position of the label relative to the file upload area. Desktop only prop. Default value on mobile will be 'top'
     *
     * @default 'top'
     */
    labelPosition?: 'top' | 'left';
    /**
     * Defines the upload behavior of the FileUpload component
     */
    uploadType?: 'single' | 'multiple';
    /**
     * File types that can be accepted. See [input's accept attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept)
     *
     * Usage: accept=".jpg, .png, .pdf", accept="image/*", accept="image/png, image/jpeg, application/pdf"
     */
    accept?: string;
    /**
     * Disables or enables the FileUpload component
     */
    isDisabled?: boolean;
    /**
     * Sets the required state of the file input
     *
     * @default false
     */
    isRequired?: boolean;
    /**
     * Renders a necessity indicator after the label. If `isRequired` is `true`, it defaults to `'required'`
     */
    necessityIndicator?: 'required' | 'optional' | 'none';
    /**
     * The name of the file upload input, [useful in form submissions](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name)
     */
    name?: string;
    /**
     * List of files that have been selected/uploaded, useful when the component is controlled
     */
    fileList?: BladeFileList;
    /**
     * Limit the number of files that can be uploaded
     */
    maxCount?: number;
    /**
     * Limit the size of the uploaded files (in bytes)
     */
    maxSize?: number;
    /**
     * Callback function triggered when files are selected
     */
    onChange?: ({ name, fileList }: {
        name?: string;
        fileList: BladeFileList;
    }) => void;
    /**
     * Callback function triggered when the preview icon is clicked
     */
    onPreview?: ({ file }: {
        file: File;
    }) => void;
    /**
     * Callback function triggered when a file is removed
     */
    onRemove?: ({ file }: {
        file: File;
    }) => void;
    /**
     * Callback function triggered when a file upload is retried
     */
    onReupload?: ({ file }: {
        file: File;
    }) => void;
    /**
     * Callback function triggered when a file upload is dismissed
     */
    onDismiss?: ({ file }: {
        file: File;
    }) => void;
    /**
     * Callback function executed when files are dropped into the upload area
     */
    onDrop?: ({ name, fileList }: {
        name?: string;
        fileList: BladeFileList;
    }) => void;
    /**
     * State indicating whether there is an error in the FileUpload component
     */
    validationState?: 'none' | 'error';
    /**
     * Additional text providing assistance or guidance
     */
    helpText?: string;
    /**
     * Text indicating an error state
     */
    errorText?: string;
    /**
     * Test ID for automation
     */
    testID?: string;
} & StyledPropsBlade & MotionMetaProp;
type FileUploadStandardSizeProps = FileUploadCommonProps & {
    /**
     * Size of the FileUpload component
     *
     * @default 'medium'
     */
    size?: 'medium' | 'large';
};
type FileUploadVariableSizeProps = FileUploadCommonProps & {
    size: 'variable';
    /**
     * Custom text for the upload action button
     */
    actionButtonText?: string;
    /**
     * Custom text for the drag & drop area
     */
    dropAreaText?: string;
    /**
     * Height of the file upload component
     */
    height?: BoxProps['height'];
    /**
     * Width of the file upload component
     */
    width?: BoxProps['width'];
};
type FileUploadPropsWithA11yLabel = {
    /**
     * Label to be shown for the input field
     */
    label?: undefined;
    /**
     * Accessibility label for the input
     */
    accessibilityLabel: string;
};
type FileUploadPropsWithLabel = {
    /**
     * Label to be shown for the input field
     */
    label: string;
    /**
     * Accessibility label for the input
     */
    accessibilityLabel?: string;
};
type FileUploadProps = (FileUploadPropsWithA11yLabel | FileUploadPropsWithLabel) & (FileUploadStandardSizeProps | FileUploadVariableSizeProps);
type FileUploadItemProps = Pick<FileUploadProps, 'onPreview' | 'onRemove' | 'onDismiss' | 'onReupload' | 'size'> & {
    file: BladeFile;
} & DataAnalyticsAttribute;
type StyledFileUploadWrapperProps = {
    isDisabled?: boolean;
    isActive: boolean;
    size: NonNullable<FileUploadProps['size']>;
    theme: Theme;
    children: React.ReactNode;
};
type StyledFileUploadItemWrapperProps = {
    status: NonNullable<BladeFile['status']>;
    size: NonNullable<FileUploadProps['size']>;
    theme: Theme;
    children: React.ReactNode;
};
type InteractiveBackgroundColors<T extends 'gray' | 'negative'> = `interactive.background.${T}.${DotNotationToken<Theme['colors']['interactive']['background'][T]>}`;
type FileUploadItemBackgroundColors = InteractiveBackgroundColors<'gray'> | InteractiveBackgroundColors<'negative'> | 'feedback.background.negative.subtle' | 'surface.background.gray.intense';
export type { BladeFile, BladeFileList, FileUploadProps, FileUploadItemProps, StyledFileUploadWrapperProps, StyledFileUploadItemWrapperProps, FileUploadItemBackgroundColors, FileUploadVariableSizeProps, };
