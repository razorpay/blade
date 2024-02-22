import { useState, useCallback, useMemo, forwardRef, memo } from 'react';
import type { FileUploadProps, BladeFile, BladeFileList } from './types';
import { StyledFileUploadWrapper } from './StyledFileUploadWrapper';
import { fileUploadColorTokens, getFileUploadInputHoverTokens } from './fileUploadTokens';
import { FileUploadItem } from './FileUploadItem';
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

const MemoizedFileUploadItem = memo(FileUploadItem);

const _FileUpload: React.ForwardRefRenderFunction<BladeElementRef, FileUploadProps> = (
  {
    name,
    accept,
    uploadType = 'single',
    onChange,
    onPreview,
    onRemove,
    onCancel,
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
  const inputLabelPosition = platform === 'onMobile' ? 'top' : labelPosition;
  const isLabelLeftPositioned = inputLabelPosition === 'left';
  const willRenderHintText =
    !isMultiple && selectedFiles.length === 1 ? false : Boolean(helpText) || Boolean(errorMessage);

  const showError = validationState === 'error' || internalValidationState === 'error';
  const showHelpText = !showError && helpText;
  const accessibilityText =
    accessibilityLabel ?? `,${showError ? errorText : ''} ${showHelpText ? helpText : ''}`;
  const { inputId, labelId, helpTextId, errorTextId } = useFormId('fileinput');

  const accessibilityProps = makeAccessible({
    required: Boolean(isRequired),
    invalid: Boolean(showError),
    disabled: Boolean(isDisabled),
    describedBy: helpTextId,
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
      display="inline-flex"
      {...metaAttribute({ name: MetaConstants.FileUpload, testID })}
      {...getStyledProps(styledProps)}
      width="100%"
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
            as="span"
            necessityIndicator={necessityIndicator}
            position={labelPosition}
            id={labelId}
            accessibilityText={accessibilityText}
          >
            {label}
          </FormLabel>
        ) : null}

        <BaseBox display="flex" flexDirection="column" marginBottom="spacing.5">
          <SelectorLabel
            componentName={MetaConstants.FileUploadLabel}
            inputProps={{}}
            style={{
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              ...(!isMultiple && selectedFiles.length === 1 ? screenReaderStyles : {}),
            }}
          >
            <BaseBox display="flex" flexDirection="column" width="100%">
              <StyledFileUploadWrapper
                isDisabled={isDisabled}
                isActive={isActive}
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                borderRadius="medium"
                borderWidth="thin"
                borderColor={
                  isDisabled
                    ? fileUploadColorTokens.border.disabled
                    : fileUploadColorTokens.border.default
                }
                padding="spacing.5"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => setIsActive(true)}
              >
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection={{ xs: 'column', s: 'row' }}
                  gap={makeSize(6)}
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
                    flexDirection={{ xs: 'column', s: 'row' }}
                    borderRadius="small"
                  >
                    <Box
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      borderBottomColor={
                        isDisabled
                          ? 'surface.border.primary.muted'
                          : 'surface.border.primary.normal'
                      }
                      borderBottomWidth="thin"
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
          {willRenderHintText && (
            <FormHint
              type={getHintType({
                validationState: showError ? 'error' : validationState,
                hasHelpText: Boolean(helpText),
              })}
              helpText={helpText}
              errorText={errorMessage}
              helpTextId={helpTextId}
              errorTextId={errorTextId}
            />
          )}
        </BaseBox>

        {selectedFiles.map((file) => (
          <MemoizedFileUploadItem
            key={file.id}
            file={file}
            onRemove={() => {
              const newFiles = selectedFiles.filter(({ id }) => id !== file.id);
              setSelectedFiles(newFiles);
              onRemove?.({ file });
            }}
            onCancel={() => {
              const newFiles = selectedFiles.filter(({ id }) => id !== file.id);
              setSelectedFiles(newFiles);
              onCancel?.({ file });
            }}
            onPreview={onPreview}
          />
        ))}
      </BaseBox>
    </BaseBox>
  );
};

const FileUpload = assignWithoutSideEffects(forwardRef(_FileUpload), {
  displayName: MetaConstants.FileUpload,
  componentId: MetaConstants.FileUpload,
});

export { FileUpload };
export type { BladeFile, BladeFileList, FileUploadProps };
