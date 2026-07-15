import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { Pressable } from 'react-native';
import type {
  FileUploadProps,
  BladeFile,
  BladeFileList,
  FileUploadVariableSizeProps,
} from './types';
import type { BladeElementRef } from '~utils/types';
import { StyledFileUploadWrapper } from './StyledFileUploadWrapper';
import {
  fileUploadColorTokens,
  fileUploadHeightTokens,
  fileUploadLinkBorderTokens,
  getFileIconExtension,
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
import { getResponsiveValue } from '~components/Box/BaseBox/getResponsiveValue';
import { makeSize } from '~utils';
import { Text } from '~components/Typography';
import { getHintType } from '~components/Input/BaseInput/BaseInput';
import { makeAccessible } from '~utils/makeAccessible';
import { useControllableState } from '~utils/useControllable';
import { throwBladeError, logger } from '~utils/logger';

// React Native's DimensionValue only accepts numbers or `${number}%` strings.
// `makeSize()`/BoxProps height & width values (e.g. "56px") need to be converted before
// being assigned to a raw style object instead of going through BaseBox's own resolution.
const toNativeDimension = (
  value: string | number | undefined,
): number | `${number}%` | undefined => {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return value;
  if (value.endsWith('%')) return value as `${number}%`;

  const numericValue = Number.parseFloat(value);
  return Number.isNaN(numericValue) ? undefined : numericValue;
};

const _FileUpload: React.ForwardRefRenderFunction<BladeElementRef, FileUploadProps> = (
  {
    name: _name,
    accept,
    uploadType = 'single',
    onChange: _onChange,
    onUploadPress,
    onPreview,
    onRemove,
    onReupload,
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
    _motionMeta,
    ...rest
  }: FileUploadProps,
  ref,
): React.ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const variableSizeRest = rest as FileUploadVariableSizeProps;
  const { actionButtonText, dropAreaText, height, width, ...styledRest } = variableSizeRest;
  const isSizeVariable = size === 'variable';
  const hasLoggedUnsupportedPropsRef = useRef(false);

  // onChange is web selection semantics; on native, consumers update fileList after their picker.
  void _onChange;
  void _name;

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

    // Log unsupported-prop warnings once per mount to avoid console spam on re-renders
    // (e.g. upload progress updates).
    if (!hasLoggedUnsupportedPropsRef.current) {
      hasLoggedUnsupportedPropsRef.current = true;

      if (maxCount !== undefined) {
        logger({
          type: 'warn',
          moduleName: 'FileUpload',
          message:
            'maxCount has no effect on React Native. File count limiting must be handled by the consumer after the file picker returns.',
        });
      }

      if (maxSize !== undefined) {
        logger({
          type: 'warn',
          moduleName: 'FileUpload',
          message:
            'maxSize has no effect on React Native. File size validation must be handled by the consumer after the file picker returns.',
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

      if (onDrop !== undefined) {
        logger({
          type: 'warn',
          moduleName: 'FileUpload',
          message:
            'onDrop has no effect on React Native. Drag-and-drop is not supported on native — use onUploadPress to open a file picker instead.',
        });
      }

      if (labelPosition === 'left') {
        logger({
          type: 'warn',
          moduleName: 'FileUpload',
          message:
            'labelPosition="left" is not supported on React Native and will be ignored. Labels always render above the upload area on native.',
        });
      }

      if (_motionMeta !== undefined) {
        logger({
          type: 'warn',
          moduleName: 'FileUpload',
          message:
            '_motionMeta is not supported on React Native. Motion ref wiring is web-only and attached to the hidden file input on web.',
        });
      }

      const analyticsProps = Object.keys(styledRest).filter(
        (key) => key.startsWith('data-analytics') || key.startsWith('elementtiming'),
      );
      if (analyticsProps.length > 0) {
        logger({
          type: 'warn',
          moduleName: 'FileUpload',
          message: `Analytics props (${analyticsProps.join(
            ', ',
          )}) are not supported on React Native. On web these are attached to the hidden file input.`,
        });
      }

      if (fileList === undefined) {
        logger({
          type: 'warn',
          moduleName: 'FileUpload',
          message:
            'FileUpload on React Native requires controlled mode. Pass the fileList prop and update it after resolving files from your picker (opened via onUploadPress). Uncontrolled usage will not reflect picked files in the UI.',
        });
      }
    }
  }

  const [selectedFiles, setSelectedFiles] = useControllableState({
    value: fileList,
    defaultValue: fileList ?? [],
  });
  const [isActive, setIsActive] = useState(false);
  const fileIdCounterRef = useRef(0);
  const assignedFileIdsRef = useRef(new WeakMap<BladeFile, string>());

  const [filesWithIds, setFilesWithIds] = useState<BladeFileList>([]);

  useEffect(() => {
    setFilesWithIds(
      selectedFiles.map((file) => {
        if (file.id) {
          return file;
        }

        const existingId = assignedFileIdsRef.current.get(file);
        if (existingId) {
          return { ...file, id: existingId };
        }

        fileIdCounterRef.current += 1;
        const id = `blade-file-${fileIdCounterRef.current}`;
        assignedFileIdsRef.current.set(file, id);
        return { ...file, id };
      }),
    );
  }, [selectedFiles]);

  const isMultiple = uploadType === 'multiple';
  const isOneFileSelectedWithSingleUpload = !isMultiple && filesWithIds.length === 1;

  const showError = validationState === 'error';
  const showHelpText = !showError && helpText;
  const willRenderHintText = Boolean(helpText) || showError;
  const accessibilityText =
    accessibilityLabel ??
    [showError ? errorText : '', showHelpText ? helpText : ''].filter(Boolean).join(' ');
  const { labelId, helpTextId, errorTextId } = useFormId('fileuploadinput');

  const handlePress = (): void => {
    if (isDisabled) return;
    // Sole native tap signal — open your document picker here. Do not fire onChange on tap.
    onUploadPress?.();
  };

  const removeFileFromSelection = (file: BladeFile): void => {
    const newFiles = filesWithIds.filter(({ id }) => id !== file.id);
    setSelectedFiles(() => newFiles);
  };

  const handleFileRemove = (file: BladeFile): void => {
    removeFileFromSelection(file);
    onRemove?.({ file });
  };

  const handleFileReupload = (file: BladeFile): void => {
    removeFileFromSelection(file);
    // TODO - Remove this in the next major release
    // Fallback to onRemove if onReupload isn't provided to avoid breaking changes in the API
    if (onReupload) {
      onReupload({ file });
    } else {
      onRemove?.({ file });
    }
    setIsActive(false);
  };

  const handleFileDismiss = (file: BladeFile): void => {
    removeFileFromSelection(file);
    onDismiss?.({ file });
  };

  const computedHeight = isSizeVariable
    ? getResponsiveValue(height) ?? '100%'
    : makeSize(fileUploadHeightTokens[size]);
  const computedWidth = isSizeVariable ? getResponsiveValue(width) ?? '100%' : '100%';

  const accessibilityProps = makeAccessible({
    required: Boolean(isRequired),
    invalid: Boolean(showError),
    disabled: Boolean(isDisabled),
    describedBy: labelId,
    label: accessibilityLabel ?? [label, accessibilityText].filter(Boolean).join(' '),
  });

  return (
    <BaseBox
      ref={ref}
      display="flex"
      flexDirection="column"
      width="100%"
      {...metaAttribute({ name: MetaConstants.FileUpload, testID })}
      {...getStyledProps(styledRest)}
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
            accessibilityRole="button"
            {...accessibilityProps}
          >
            <StyledFileUploadWrapper
              size={size}
              isDisabled={isDisabled}
              isActive={isActive}
              style={{
                height: toNativeDimension(computedHeight),
                width: toNativeDimension(computedWidth),
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

                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="row"
                  gap={makeSize(2)}
                >
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
            file={filesWithIds[0]}
            size={size}
            onRemove={() => handleFileRemove(filesWithIds[0])}
            onReupload={() => handleFileReupload(filesWithIds[0])}
            onDismiss={() => handleFileDismiss(filesWithIds[0])}
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
        filesWithIds.map((file, index) => (
          <BaseBox
            key={file.id}
            marginLeft={makeSize(0)}
            marginTop={index === 0 ? 'spacing.5' : 'spacing.3'}
          >
            <FileUploadItem
              file={file}
              size={size}
              onRemove={() => handleFileRemove(file)}
              onReupload={() => handleFileReupload(file)}
              onDismiss={() => handleFileDismiss(file)}
              onPreview={onPreview}
            />
          </BaseBox>
        ))}
    </BaseBox>
  );
};

const FileUpload = assignWithoutSideEffects(forwardRef(_FileUpload), {
  displayName: 'FileUpload',
  componentId: 'FileUpload',
});

export { FileUpload };
export type { BladeFile, BladeFileList, FileUploadProps };
