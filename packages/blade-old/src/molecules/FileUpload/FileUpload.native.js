import React, { useEffect, useState } from 'react';
import { TouchableOpacity, LayoutAnimation } from 'react-native';
import styled from 'styled-components/native';
import DocumentPicker from 'react-native-document-picker';
import PropTypes from 'prop-types';
import View from '../../atoms/View';
import Text from '../../atoms/Text';
import Size from '../../atoms/Size';
import Flex from '../../atoms/Flex';
import Space from '../../atoms/Space';
import Icon from '../../atoms/Icon';
import ProgressBar from './ProgressBar';

const MAX_PROGRESS_VALUE = 100;

const DashedButton = styled(TouchableOpacity)`
  background-color: ${(props) => props.theme.bladeOld.colors.background[200]};
  border: 1px dashed ${(props) => props.theme.bladeOld.colors.tone[900]};
  border-radius: 2px;
`;

const UploadContainer = styled(View)`
  border: 1px solid ${(props) => props.theme.bladeOld.colors.tone[900]};
  background-color: ${(props) => props.theme.bladeOld.colors.background[200]};
  border-radius: 4px;
`;

const FileUpload = ({
  title,
  progress,
  fileName,
  fileTypes,
  errorText,
  helpText,
  onFileSelectionError,
  onFileSelected,
  onFileRemoved,
}) => {
  const [file, setFileName] = useState(fileName);
  const hasUploadCompleted = progress >= MAX_PROGRESS_VALUE;

  const handleFileRemoval = () => {
    onFileRemoved();
  };

  useEffect(() => {
    if (fileName) {
      setFileName(fileName);
    } else if (!fileName) {
      setFileName('');
    }
    LayoutAnimation.easeInEaseOut();
  }, [fileName]);

  const handleFilePick = async () => {
    try {
      const document = await DocumentPicker.pick({
        type: !fileTypes
          ? DocumentPicker.types.allFiles
          : Object.keys(DocumentPicker.types).filter((type) => fileTypes.includes(type)),
      });
      setFileName(document.name);
      onFileSelected({
        uri: document.uri,
        type: document.type,
        name: document.name,
        size: document.size,
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User when cancels the native selection
      } else {
        onFileSelectionError(err);
      }
    }
  };

  return (
    <Size width="100%">
      <View>
        <Size height={6}>
          <Flex alignItems="center" justifyContent="center">
            {file ? (
              <Space padding={[1, 1.5]}>
                <UploadContainer>
                  <Flex flexDirection="row" alignItems="center">
                    <Space margin={[0, 0, 1, 0]}>
                      <View>
                        {hasUploadCompleted && !errorText ? (
                          <Space margin={[0, 1, 0, 0]}>
                            <View>
                              <Icon size="small" fill="positive.960" name="checkedCircle" />
                            </View>
                          </Space>
                        ) : null}
                        <Flex flex={2}>
                          <View>
                            <Text size="xsmall" color="shade.980">
                              {title}
                            </Text>
                          </View>
                        </Flex>
                        <TouchableOpacity onPress={handleFileRemoval}>
                          <Icon size="small" name="close" fill="shade.800" />
                        </TouchableOpacity>
                      </View>
                    </Space>
                  </Flex>
                  <ProgressBar size="small" progress={progress} error={errorText} />
                </UploadContainer>
              </Space>
            ) : (
              <Space padding={[1.25, 1.5]}>
                <DashedButton onPress={handleFilePick} activeOpacity={0.7}>
                  <Flex flexDirection="row">
                    <View>
                      <Icon name="uploadCloud" fill="primary.800" size="small" />
                      <Space margin={[0, 0, 0, 0.5]}>
                        <View>
                          <Text size="xsmall" weight="bold" color="primary.800" maxLines={1}>
                            {title}
                          </Text>
                        </View>
                      </Space>
                    </View>
                  </Flex>
                </DashedButton>
              </Space>
            )}
          </Flex>
        </Size>
        {errorText || helpText ? (
          <Space margin={[0.5, 0, 0, 0]}>
            <View>
              <Text size="xsmall" color={errorText ? 'negative.900' : 'shade.950'}>
                {errorText || helpText}
              </Text>
            </View>
          </Space>
        ) : null}
      </View>
    </Size>
  );
};

FileUpload.propTypes = {
  progress: PropTypes.number,
  title: PropTypes.string,
  fileName: PropTypes.string,
  fileTypes: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(DocumentPicker.types))), // Accepts: ["allFiles", "audio", "csv", "doc", "docx", "images", "pdf", "plainText", "ppt", "pptx", "video", "xls", "xlsx", "zip"]
  errorText: PropTypes.string,
  helpText: PropTypes.string,
  onFileSelectionError: PropTypes.func,
  onFileSelected: PropTypes.func,
  onFileRemoved: PropTypes.func,
};

FileUpload.defaultProps = {
  fileName: '',
  title: 'Upload',
  onFileSelectionError: () => {},
  onFileSelected: () => {},
  onFileRemoved: () => {},
  progress: 0,
};

export default FileUpload;
