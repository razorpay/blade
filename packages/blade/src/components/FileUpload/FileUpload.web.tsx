import { useState, useCallback, useMemo, forwardRef } from 'react';
import type { FileUploadProps, BladeFile, BladeFileList } from './types';
import { StyledFileUploadWrapper } from './StyledFileUploadWrapper';
import {
  fileUploadColorTokens,
  fileUploadLinkBorderTokens,
  getFileUploadInputHoverTokens,
} from './fileUploadTokens';
import { FileUploadItem } from './FileUploadItem';
import { isFileAccepted } from './isFileAccepted';
import BaseBox from '~components/Box/BaseBox';
import { Box } from '~components/Box';
import { SelectorLabel } from '~components/Form/Selector/SelectorLabel';
import { SelectorInput } from '~components/Form/Selector/SelectorInput';
import { screenReaderStyles } from '~components/VisuallyHidden';
import { FormHint, FormLabel } from '~components/Form';
import { useFormId } from '~components/Form/useFormId';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import { makeSize, useTheme } from '~utils';
import { Text } from '~components/Typography';
import type { BladeElementRef } from '~utils/types';
import { getHintType } from '~components/Input/BaseInput/BaseInput';
import { makeAccessible } from '~utils/makeAccessible';
import { formHintLeftLabelMarginLeft } from '~components/Input/BaseInput/baseInputTokens';

const _FileUpload: React.ForwardRefRenderFunction<BladeElementRef, FileUploadProps> = (
  {
    name,
    accept,
    uploadType = 'single',
    onChange,
    onPreview,
    onRemove,
    onDismiss,
    onDrop,
    isDisabled,
    isRequired,
    necessityIndicator,
    fileList,
    testID,
    label,
    labelPosition = 'top',
    accessibilityLabel,
    validationState,
    helpText,
    errorText,
    maxCount,
    maxSize,
    size = 'medium',
    ...styledProps
  },
  ref,
): React.ReactElement => {
  const { platform } = useTheme();
  const [selectedFiles, setSelectedFiles] = useState<BladeFileList>(fileList ?? []);
  const [errorMessage, setErrorMessage] = useState(errorText);
  const [internalValidationState, setInternalValidationState] = useState('none');
  const [isActive, setIsActive] = useState(false);

  const isMultiple = uploadType === 'multiple';
  const isOneFileSelectedWithSingleUpload = !isMultiple && selectedFiles.length === 1;
  const inputLabelPosition = platform === 'onMobile' ? 'top' : labelPosition;
  const isLabelLeftPositioned = inputLabelPosition === 'left';
  const willRenderHintText = Boolean(helpText) || Boolean(errorMessage);

  const showError = validationState === 'error' || internalValidationState === 'error';
  const showHelpText = !showError && helpText;
  const accessibilityText =
    accessibilityLabel ?? `,${showError ? errorText : ''} ${showHelpText ? helpText : ''}`;
  const { inputId, labelId, helpTextId, errorTextId } = useFormId('fileuploadinput');

  const accessibilityProps = makeAccessible({
    required: Boolean(isRequired),
    invalid: Boolean(showError),
    disabled: Boolean(isDisabled),
    describedBy: labelId,
  });

  // In control mode attach a unique id to each file if not provided
  useMemo(() => {
    for (const file of selectedFiles) {
      if (!file.id) {
        file.id = `${new Date().getTime().toString()}${Math.floor(Math.random() * 1000000)}`;
      }
    }
  }, [selectedFiles]);

  const handleFilesChange = useCallback((inputFiles: BladeFileList) => {
    setSelectedFiles((prevFiles) => {
      if (prevFiles.length > 0) {
        const allFiles = [...prevFiles, ...inputFiles];
        return allFiles;
      }

      return inputFiles;
    });
  }, []);

  const validateFiles = (inputFiles: BladeFileList, allFiles: BladeFileList): boolean => {
    if (accept && inputFiles.some((file) => !isFileAccepted(file, accept))) {
      setErrorMessage(`You provided an unsupported file type. Supported file types are: ${accept}`);
      setInternalValidationState('error');
      return true;
    }

    if (uploadType === 'single' && inputFiles.length > 1) {
      setErrorMessage('You can upload only one file.');
      setInternalValidationState('error');
      return true;
    }

    if (maxCount && allFiles.length > maxCount) {
      setErrorMessage(`You can't upload more than ${maxCount} files.`);
      setInternalValidationState('error');
      return true;
    }

    if (maxSize && inputFiles.some((file) => file.size > maxSize)) {
      setErrorMessage('File size exceeded.');
      setInternalValidationState('error');
      return true;
    }

    setInternalValidationState('none');
    setErrorMessage('');
    return false;
  };

  const handleDragOver = (event: React.DragEvent): void => {
    event.preventDefault();
    setIsActive(true);
  };

  const handleDragLeave = (event: React.DragEvent): void => {
    event.preventDefault();
    setIsActive(false);
  };

  const handleDrop = (event: React.DragEvent): void => {
    event.preventDefault();
    setIsActive(false);

    const droppedFiles = Array.from(event.dataTransfer.files);
    const allFiles = selectedFiles.length > 0 ? [...selectedFiles, ...droppedFiles] : droppedFiles;

    const hasValidationErrors = validateFiles(droppedFiles, allFiles);

    if (!hasValidationErrors) {
      handleFilesChange(droppedFiles);
      onDrop?.({ name, fileList: allFiles });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const inputFiles = Array.from(event.target.files ?? []);
    const allFiles = selectedFiles.length > 0 ? [...selectedFiles, ...inputFiles] : inputFiles;

    const hasValidationErrors = validateFiles(inputFiles, allFiles);

    if (!hasValidationErrors) {
      handleFilesChange(inputFiles);
      onChange?.({ name, fileList: allFiles });
    }
  };

  return (
    <BaseBox
      display="flex"
      flexDirection="column"
      width="100%"
      {...metaAttribute({ name: MetaConstants.FileUpload, testID })}
      {...getStyledProps(styledProps)}
    >
      <BaseBox
        display="flex"
        flexDirection={isLabelLeftPositioned ? 'row' : 'column'}
        alignItems={isLabelLeftPositioned ? 'center' : undefined}
        position="relative"
        width="100%"
      >
        {label ? (
          <FormLabel
            size={size}
            as="span"
            necessityIndicator={necessityIndicator}
            position={labelPosition}
            id={labelId}
            accessibilityText={accessibilityText}
          >
            {label}
          </FormLabel>
        ) : null}

        <SelectorLabel
          componentName={MetaConstants.FileUploadLabel}
          inputProps={{}}
          style={{
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            width: '100%',
          }}
        >
          <BaseBox
            display="flex"
            flexDirection="column"
            width="100%"
            marginBottom={willRenderHintText ? 'spacing.0' : 'spacing.5'}
          >
            <StyledFileUploadWrapper
              size={size}
              isDisabled={isDisabled}
              isActive={isActive}
              display="flex"
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              borderRadius="medium"
              borderWidth="thin"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => setIsActive(true)}
              data-comp="f"
              style={{
                ...(isOneFileSelectedWithSingleUpload ? screenReaderStyles : {}),
              }}
            >
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection={{ base: 'column', s: 'row' }}
                gap={makeSize(6)}
                padding="spacing.3"
              >
                <Text
                  color={
                    isDisabled
                      ? fileUploadColorTokens.text.disabled
                      : fileUploadColorTokens.text.default
                  }
                >
                  Drag files here or{' '}
                </Text>
                <SelectorInput
                  id={inputId}
                  hoverTokens={getFileUploadInputHoverTokens()}
                  isChecked={false}
                  isDisabled={isDisabled}
                  inputProps={{
                    name,
                    type: 'file',
                    onChange: handleInputChange,
                    multiple: isMultiple,
                    required: isRequired,
                    disabled: isDisabled,
                    accept,
                    onBlur: () => setIsActive(false),
                    ...accessibilityProps,
                  }}
                  ref={ref}
                />

                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection={{ base: 'column', s: 'row' }}
                  borderRadius="small"
                >
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    borderBottomColor={
                      fileUploadLinkBorderTokens.color[isDisabled ? 'disabled' : 'default']
                    }
                    borderBottomWidth={fileUploadLinkBorderTokens.width.default}
                  >
                    <Text
                      color={
                        isDisabled
                          ? fileUploadColorTokens.link.disabled
                          : fileUploadColorTokens.link.default
                      }
                    >
                      Upload
                    </Text>
                  </Box>
                </Box>
              </Box>
            </StyledFileUploadWrapper>
          </BaseBox>
        </SelectorLabel>
        {isOneFileSelectedWithSingleUpload && (
          <FileUploadItem
            file={selectedFiles[0]}
            size={size}
            onRemove={() => {
              const newFiles = selectedFiles.filter(({ id }) => id !== selectedFiles[0].id);
              setSelectedFiles(newFiles);
              onRemove?.({ file: selectedFiles[0] });
            }}
            onDismiss={() => {
              const newFiles = selectedFiles.filter(({ id }) => id !== selectedFiles[0].id);
              setSelectedFiles(newFiles);
              onDismiss?.({ file: selectedFiles[0] });
            }}
            onPreview={onPreview}
          />
        )}
      </BaseBox>
      {willRenderHintText && (
        <BaseBox
          marginLeft={makeSize(
            label && isLabelLeftPositioned ? formHintLeftLabelMarginLeft[size] : 0,
          )}
          marginBottom="spacing.5"
        >
          <BaseBox display="flex" flexDirection="row" justifyContent="'space-between">
            <FormHint
              size={size}
              type={getHintType({
                validationState: showError ? 'error' : validationState,
                hasHelpText: Boolean(helpText),
              })}
              helpText={helpText}
              errorText={errorMessage}
              helpTextId={helpTextId}
              errorTextId={errorTextId}
            />
          </BaseBox>
        </BaseBox>
      )}
      {!isOneFileSelectedWithSingleUpload &&
        selectedFiles.map((file) => (
          <BaseBox
            key={file.id}
            marginLeft={makeSize(
              label && isLabelLeftPositioned ? formHintLeftLabelMarginLeft[size] : 0,
            )}
            marginBottom="spacing.3"
          >
            <FileUploadItem
              file={file}
              size={size}
              onRemove={() => {
                const newFiles = selectedFiles.filter(({ id }) => id !== file.id);
                setSelectedFiles(newFiles);
                onRemove?.({ file });
              }}
              onDismiss={() => {
                const newFiles = selectedFiles.filter(({ id }) => id !== file.id);
                setSelectedFiles(newFiles);
                onDismiss?.({ file });
              }}
              onPreview={onPreview}
            />
          </BaseBox>
        ))}
    </BaseBox>
  );
};

/**
 * ### FileUpload Component
 * 
 * The FileUpload component is used to handle file attachments, including the drag-and-drop interaction.
 * Primarily, it is used to upload files to a server or to display a list of uploaded files.
 * 
 * ---
 * 
 * #### Usage
 * 
 * ```jsx
  const GSTForm = () => {
   const [selectedFile, setSelectedFile] = useState<BladeFile>();
   const [isLoading, setIsLoading] = useState(false);
 
   return (
    <Box>
      <Heading marginBottom="spacing.4">Add GST Details</Heading>
      <form encType="multipart/form-data" onSubmit={handleSubmit}>
          <FileUpload
            uploadType="single"
            label="Upload GST"
            helpText="Upload .jpg, .jpeg, or .png file only"
            accept=".jpg, .jpeg, .png"
            onChange={({ fileList }) => {
              setSelectedFile(fileList[0]);
            }}
            onDrop={({ fileList }) => {
              setSelectedFile(fileList[0]);
            }}
            isRequired
            necessityIndicator="required"
          />
          <Button type="submit" variant="primary">
            Submit
          </Button>
          {isLoading && (
            <ProgressBar isIndeterminate label="Uploading your GST Certificate..." />
          )}
      </form>
    </Box>
   );
  }
 * ```
 *
 *  ---
 *
 * Checkout {@link https://blade.razorpay.com/?path=/docs/components-fileupload FileUpload Documentation}
 * 
 */
const FileUpload = assignWithoutSideEffects(forwardRef(_FileUpload), {
  displayName: 'FileUpload',
  componentId: 'FileUpload',
});

export { FileUpload };
export type { BladeFile, BladeFileList, FileUploadProps };
