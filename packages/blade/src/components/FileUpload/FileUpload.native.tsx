import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import type {
  FileUploadProps,
  BladeFile,
  BladeFileList,
  FileUploadVariableSizeProps,
} from './types';
import { StyledFileUploadWrapper } from './StyledFileUploadWrapper';
import {
  fileUploadColorTokens,
  fileUploadHeightTokens,
  fileUploadLinkBorderTokens,
} from './fileUploadTokens';
import { FileUploadItem } from './FileUploadItem';
import { FileUploadItemIcon } from './FileUploadItemIcon';
import BaseBox from '~components/Box/BaseBox';
import { Box } from '~components/Box';
import { FormHint, FormLabel } from '~components/Form';
import { useFormId } from '~components/Form/useFormId';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import { makeSize } from '~utils';
import { Text } from '~components/Typography';
import { getHintType } from '~components/Input/BaseInput/BaseInput';
import { makeAccessible } from '~utils/makeAccessible';
import { useControllableState } from '~utils/useControllable';
import { throwBladeError, logger } from '~utils/logger';

const getFileIconExtension = (acceptValue?: string): string => {
  if (!acceptValue) return 'example.xyz';

  const extensions = acceptValue
    .split(',')
    .map((ext) => ext.trim())
    .filter((ext) => ext.startsWith('.'));

  return extensions.length === 1 ? `example${extensions[0]}` : 'example.xyz';
};

const _FileUpload = ({
  name,
  accept,
  uploadType = 'single',
  onChange,
  onPreview,
  onRemove,
  onReupload,
  onDismiss,
  isDisabled,
  isRequired,
  necessityIndicator,
  fileList,
  testID,
  label,
  accessibilityLabel,
  validationState,
  helpText,
  errorText,
  maxCount,
  maxSize,
  size = 'medium',
  ...rest
}: FileUploadProps): React.ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const { actionButtonText, dropAreaText, height, width } = rest as FileUploadVariableSizeProps;
  const isSizeVariable = size === 'variable';

  if (__DEV__) {
    if (!isSizeVariable && (actionButtonText || dropAreaText)) {
      const propName =
        actionButtonText && dropAreaText
          ? 'actionButtonText and dropAreaText'
          : dropAreaText
          ? 'dropAreaText'
          : 'actionButtonText';

      throwBladeError({
        message: `${propName} can only be used when size is "variable"`,
        moduleName: 'FileUpload',
      });
    }

    if (!isSizeVariable && (height || width)) {
      const propName = height && width ? 'height and width' : height ? 'height' : 'width';

      throwBladeError({
        message: `${propName} can only be used when size is "variable"`,
        moduleName: 'FileUpload',
      });
    }

    if (maxCount !== undefined) {
      logger({
        type: 'warn',
        moduleName: 'FileUpload',
        message:
          'maxCount has no effect on React Native. File count limiting must be handled by the consumer in the onChange callback.',
      });
    }

    if (maxSize !== undefined) {
      logger({
        type: 'warn',
        moduleName: 'FileUpload',
        message:
          'maxSize has no effect on React Native. File size validation must be handled by the consumer in the onChange callback.',
      });
    }

    if (accept !== undefined) {
      logger({
        type: 'warn',
        moduleName: 'FileUpload',
        message:
          'accept has no effect on React Native for file filtering. Configure the accepted file types in your file picker (e.g. react-native-document-picker) directly.',
      });
    }

    if (fileList === undefined) {
      logger({
        type: 'warn',
        moduleName: 'FileUpload',
        message:
          'FileUpload on React Native requires controlled mode. Pass the fileList prop and update it inside the onChange callback (e.g. after resolving files from react-native-document-picker). Uncontrolled usage will not reflect picked files in the UI.',
      });
    }
  }

  const [selectedFiles, setSelectedFiles] = useControllableState({
    value: fileList,
    defaultValue: fileList ?? [],
  });
  const [isActive, setIsActive] = useState(false);

  const isMultiple = uploadType === 'multiple';
  const isOneFileSelectedWithSingleUpload = !isMultiple && selectedFiles.length === 1;

  const showError = validationState === 'error';
  const showHelpText = !showError && helpText;
  const willRenderHintText = Boolean(helpText) || showError;
  const accessibilityText =
    accessibilityLabel ?? `,${showError ? errorText : ''} ${showHelpText ? helpText : ''}`;
  const { labelId, helpTextId, errorTextId } = useFormId('fileuploadinput');

  useEffect(() => {
    for (const file of selectedFiles) {
      if (!file.id) {
        file.id = `${new Date().getTime().toString()}${Math.floor(Math.random() * 1000000)}`;
      }
    }
  }, [selectedFiles]);

  const handlePress = (): void => {
    // On native, pressing the upload area fires onChange as a tap signal.
    // fileList is always empty at tap time — the consumer must open their own
    // file picker (e.g. react-native-document-picker) in this callback.
    onChange?.({ name, fileList: [] });
  };

  const computedHeight = isSizeVariable ? height ?? '100%' : makeSize(fileUploadHeightTokens[size]);
  const computedWidth = isSizeVariable ? width ?? '100%' : '100%';

  const accessibilityProps = makeAccessible({
    required: Boolean(isRequired),
    invalid: Boolean(showError),
    disabled: Boolean(isDisabled),
    describedBy: labelId,
    label: accessibilityLabel,
  });

  return (
    <BaseBox
      display="flex"
      flexDirection="column"
      width="100%"
      {...metaAttribute({ name: MetaConstants.FileUpload, testID })}
      {...getStyledProps(rest)}
    >
      <BaseBox display="flex" flexDirection="column" position="relative" width="100%">
        {label ? (
          <FormLabel
            size={isSizeVariable ? 'large' : size}
            as="span"
            necessityIndicator={necessityIndicator}
            position="top"
            id={labelId}
            accessibilityText={accessibilityText}
          >
            {label}
          </FormLabel>
        ) : null}

        {!isOneFileSelectedWithSingleUpload ? (
          <Pressable
            onPress={handlePress}
            onPressIn={() => setIsActive(true)}
            onPressOut={() => setIsActive(false)}
            disabled={isDisabled}
            {...accessibilityProps}
          >
            <StyledFileUploadWrapper
              size={size}
              isDisabled={isDisabled}
              isActive={isActive}
              style={{
                height: typeof computedHeight === 'number' ? computedHeight : undefined,
                width: typeof computedWidth === 'number' ? computedWidth : undefined,
              }}
            >
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                gap={makeSize(6)}
                padding="spacing.3"
              >
                {isSizeVariable && (
                  <FileUploadItemIcon
                    fileName={getFileIconExtension(accept)}
                    uploadStatus="success"
                  />
                )}

                <Text
                  color={
                    isDisabled
                      ? fileUploadColorTokens.text.disabled
                      : fileUploadColorTokens.text.default
                  }
                >
                  {isSizeVariable ? dropAreaText ?? 'Tap to upload your files' : 'Tap to'}{' '}
                </Text>

                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
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
                      {actionButtonText ?? 'Upload'}
                    </Text>
                  </Box>
                </Box>
              </Box>
            </StyledFileUploadWrapper>
          </Pressable>
        ) : null}

        {isOneFileSelectedWithSingleUpload && (
          <FileUploadItem
            file={selectedFiles[0]}
            size={size}
            onRemove={() => {
              const newFiles = selectedFiles.filter(({ id }) => id !== selectedFiles[0].id);
              setSelectedFiles(() => newFiles);
              onRemove?.({ file: selectedFiles[0] });
            }}
            onReupload={() => {
              const newFiles = selectedFiles.filter(({ id }) => id !== selectedFiles[0].id);
              setSelectedFiles(() => newFiles);
              if (onReupload) {
                onReupload({ file: selectedFiles[0] });
              } else {
                onRemove?.({ file: selectedFiles[0] });
              }
              setIsActive(false);
            }}
            onDismiss={() => {
              const newFiles = selectedFiles.filter(({ id }) => id !== selectedFiles[0].id);
              setSelectedFiles(() => newFiles);
              onDismiss?.({ file: selectedFiles[0] });
            }}
            onPreview={onPreview}
          />
        )}
      </BaseBox>
      {willRenderHintText && (
        <BaseBox marginLeft={makeSize(0)}>
          <BaseBox display="flex" flexDirection="row">
            <FormHint
              size={isSizeVariable ? 'large' : size}
              type={getHintType({
                validationState: showError ? 'error' : validationState,
                hasHelpText: Boolean(helpText),
              })}
              helpText={helpText}
              errorText={errorText}
              helpTextId={helpTextId}
              errorTextId={errorTextId}
            />
          </BaseBox>
        </BaseBox>
      )}
      {!isOneFileSelectedWithSingleUpload &&
        selectedFiles.map((file, index) => (
          <BaseBox
            key={file.id}
            marginLeft={makeSize(0)}
            marginTop={index === 0 ? 'spacing.5' : 'spacing.3'}
          >
            <FileUploadItem
              file={file}
              size={size}
              onRemove={() => {
                const newFiles = selectedFiles.filter(({ id }) => id !== file.id);
                setSelectedFiles(() => newFiles);
                onRemove?.({ file });
              }}
              onReupload={() => {
                const newFiles = selectedFiles.filter(({ id }) => id !== file.id);
                setSelectedFiles(() => newFiles);
                if (onReupload) {
                  onReupload({ file });
                } else {
                  onRemove?.({ file });
                }
                setIsActive(false);
              }}
              onDismiss={() => {
                const newFiles = selectedFiles.filter(({ id }) => id !== file.id);
                setSelectedFiles(() => newFiles);
                onDismiss?.({ file });
              }}
              onPreview={onPreview}
            />
          </BaseBox>
        ))}
    </BaseBox>
  );
};

const FileUpload = assignWithoutSideEffects(_FileUpload, {
  displayName: 'FileUpload',
  componentId: 'FileUpload',
});

export { FileUpload };
export type { BladeFile, BladeFileList, FileUploadProps };
