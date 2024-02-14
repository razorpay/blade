import { useState, forwardRef } from 'react';
import type { FileUploadProps, BladeFile, BladeFileList } from './types';
import BaseBox from '~components/Box/BaseBox';
import { SelectorLabel } from '~components/Form/Selector/SelectorLabel';
import { SelectorInput } from '~components/Form/Selector/SelectorInput';
import { FormHint, FormLabel } from '~components/Form';
import { useFormId } from '~components/Form/useFormId';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import { throwBladeError } from '~utils/logger';
import { makeSize, useTheme } from '~utils';
import { Text } from '~components/Typography';
import { FileUploadItem } from './FileUploadItem';
import { getFileUploadInputHoverTokens } from './fileUploadTokens';
import { StyledFileUploadWrapper } from './StyledFileUploadWrapper';
import { Link } from '~components/Link';
import { UploadIcon } from '~components/Icons';
import getIn from '~utils/lodashButBetter/get';
import type { BladeElementRef } from '~utils/types';
import { getHintType } from '~components/Input/BaseInput/BaseInput';

const _FileUpload: React.ForwardRefRenderFunction<BladeElementRef, FileUploadProps> = (
  {
    name,
    accept,
    selectionType = 'multiple',
    onChange,
    onPreview,
    onRemove,
    onDrop,
    isDisabled,
    isRequired,
    necessityIndicator,
    defaultFileList,
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
  const [selectedFiles, setSelectedFiles] = useState<BladeFileList>(
    fileList ?? defaultFileList ?? [],
  );
  const [errorMessage, setErrorMessage] = useState(errorText);
  const [internalValidationState, setInternalValidationState] = useState('none');
  const isMultiple = selectionType === 'multiple';
  const inputLabelPosition = platform === 'onMobile' ? 'top' : labelPosition;
  const isLabelLeftPositioned = inputLabelPosition === 'left';
  const willRenderHintText = Boolean(helpText) || Boolean(errorMessage);
  const showError = validationState === 'error' || internalValidationState === 'error';
  const showHelpText = !showError && helpText;
  const accessibilityText =
    accessibilityLabel ?? `,${showError ? errorText : ''} ${showHelpText ? helpText : ''}`;
  const { inputId, labelId, helpTextId, errorTextId } = useFormId('fileinput');

  function handleInputChange(event): void {
    const inputFiles: BladeFileList =
      selectionType === 'multiple' && selectedFiles.length > 0
        ? [...selectedFiles, ...event.target.files]
        : [...event.target.files];

    // Attach a unique id to each file
    for (const file of inputFiles) {
      file.id = `${new Date().getTime().toString()}${Math.floor(Math.random() * 1000000)}`;
      file.status = 'success';
    }

    if (maxCount && inputFiles.length > maxCount) {
      setErrorMessage(`You can't upload more than ${maxCount} files.`);
      setInternalValidationState('error');
    } else if (maxSize && inputFiles.some((file) => file.size > maxSize)) {
      setErrorMessage('File size exceeded.');
      setInternalValidationState('error');
    } else {
      setSelectedFiles(inputFiles);
      setInternalValidationState('none');
      onChange?.({ name, fileList: inputFiles });
    }
  }

  return (
    <BaseBox
      display="inline-flex"
      {...metaAttribute({ name: MetaConstants.FileUpload, testID })}
      {...getStyledProps(styledProps)}
    >
      <BaseBox
        display="flex"
        flexDirection={isLabelLeftPositioned ? 'row' : 'column'}
        alignItems={isLabelLeftPositioned ? 'center' : undefined}
        position="relative"
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

        {isMultiple || (!isMultiple && selectedFiles.length === 0) ? (
          <BaseBox display="flex" flexDirection="column" marginBottom="spacing.5">
            <SelectorLabel
              componentName={MetaConstants.FileUploadLabel}
              inputProps={{}}
              style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
            >
              <BaseBox display="flex" flexDirection="column" width="100%">
                <StyledFileUploadWrapper
                  display="flex"
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                  borderRadius="medium"
                  borderWidth="thin"
                  borderColor="interactive.border.gray.default"
                  paddingLeft="spacing.10"
                  paddingRight="spacing.10"
                >
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
                      accept,
                    }}
                    ref={ref}
                  />

                  <BaseBox display="flex" justifyContent="center" flexDirection="row">
                    <Text>Drag files here or </Text>
                    <Text as="span" color="interactive.text.primary.subtle" marginLeft="spacing.2">
                      <UploadIcon
                        size="small"
                        color="interactive.icon.primary.subtle"
                        marginRight="spacing.2"
                      />
                      Upload
                    </Text>
                  </BaseBox>
                </StyledFileUploadWrapper>
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
            </SelectorLabel>
          </BaseBox>
        ) : null}

        {selectedFiles.map((file) => (
          <FileUploadItem
            key={file.id}
            file={file}
            onRemove={() => {
              const newFiles = selectedFiles.filter(({ id }) => id !== file.id);
              setSelectedFiles(newFiles);
              onRemove?.({ removedFile: file });
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
