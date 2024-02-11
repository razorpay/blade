import { useState } from 'react';
import type { FileUploadProps, BladeFile, BladeFileList } from './types';
import BaseBox from '~components/Box/BaseBox';
import { SelectorLabel } from '~components/Form/Selector/SelectorLabel';
import { SelectorInput } from '~components/Form/Selector/SelectorInput';
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

const _FileUpload = ({
  name,
  accept,
  selectionType,
  onChange,
  isDisabled,
  fileList = [],
  testID,
  ...styledProps
}: FileUploadProps): React.ReactElement => {
  const { theme } = useTheme();

  //   const [files, setFiles] = useState(fileList);
  //   console.log('files->', files);
  //   function handleChange(event) {
  //     const inputFiles =
  //       files.length > 0 ? [...files, ...event.target.files] : [...event.target.files];
  //     setFiles(inputFiles);
  //     onChange({ name, files: inputFiles });
  // }

  return (
    <BaseBox
      {...metaAttribute({ name: MetaConstants.FileUpload, testID })}
      {...getStyledProps(styledProps)}
      display="inline-flex"
    >
      <SelectorLabel
        componentName={MetaConstants.ChipLabel}
        // onTouchStart={handlePointerPressedIn}
        // onTouchEnd={handlePointerPressedOut}
        // onMouseDown={handlePointerPressedIn}
        // onMouseUp={handlePointerPressedOut}
        // onMouseOut={handlePointerPressedOut}
        // onKeyDown={handleKeyboardPressedIn}
        // onKeyUp={handleKeyboardPressedOut}
        inputProps={{}}
        style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
      >
        <BaseBox display="flex" flexDirection="column">
          <StyledFileUploadWrapper
            display="flex"
            alignItems="center"
            flexDirection="row"
            justifyItems="center"
            borderRadius="medium"
            borderWidth="thin"
            borderColor="interactive.border.gray.default"
          >
            <SelectorInput
              hoverTokens={getFileUploadInputHoverTokens()}
              isChecked={false}
              isDisabled={isDisabled}
              inputProps={{ type: 'file' }}
              //ref={ref}
            />
            <Text>Drag files here or </Text>
            <BaseBox display="flex" alignItems="center" justifyItems="center" flexDirection="row">
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
        </BaseBox>
      </SelectorLabel>
    </BaseBox>
  );
};

const FileUpload = assignWithoutSideEffects(_FileUpload, {
  displayName: 'FileUpload',
  componentId: 'FileUpload',
});

export { FileUpload };
export type { BladeFile, BladeFileList, FileUploadProps };
