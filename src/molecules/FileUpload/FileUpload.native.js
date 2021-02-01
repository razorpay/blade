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
  background-color: ${(props) => props.theme.colors.background[200]};
  border: 1px dashed ${(props) => props.theme.colors.tone[900]};
  border-radius: 2px;
  padding: 10px 12px;
`;

const UploadContainer = styled(View)`
  padding: 8px 12px;
  border: 1px solid ${(props) => props.theme.colors.tone[900]};
  background-color: ${(props) => props.theme.colors.background[200]};
`;

const FileUpload = ({
  title,
  progress,
  file,
  accept,
  errorText,
  helpText,
  onError,
  onFileUpload,
}) => {
  const [fileName, setFileName] = useState(file);
  const hasUploadCompleted = progress >= MAX_PROGRESS_VALUE;

  const handleClose = () => {
    setFileName('');
    LayoutAnimation.easeInEaseOut();
  };

  useEffect(() => {
    if (file) {
      setFileName(file);
    } else if (!file) {
      setFileName('');
    }
  }, [file]);

  const handleDocumentPick = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: !accept
          ? DocumentPicker.types.allFiles
          : Object.keys(DocumentPicker.types).filter((type) => accept.includes(type)),
      });
      console.log('OPOPOP', {
        uri: res.uri,
        type: res.type,
        name: res.name,
        size: res.size,
      });
      onFileUpload({
        uri: res.uri,
        type: res.type,
        name: res.name,
        size: res.size,
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User when cancels the native selection
      } else {
        onError(err);
      }
    }
  };

  return (
    <View>
      <Size height={6} width={30}>
        <Flex alignItems="center" justifyContent="center">
          {fileName ? (
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
                    <TouchableOpacity onPress={handleClose}>
                      <Icon size="small" name="close" fill="shade.800" />
                    </TouchableOpacity>
                  </View>
                </Space>
              </Flex>
              <ProgressBar size="small" progress={progress} error={errorText} />
            </UploadContainer>
          ) : (
            <DashedButton onPress={handleDocumentPick}>
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
  );
};

FileUpload.propTypes = {
  progress: PropTypes.number,
  title: PropTypes.string,
  file: PropTypes.string,
  accept: PropTypes.arrayOf(Object.keys(DocumentPicker.types)), // Accepts: ["allFiles", "audio", "csv", "doc", "docx", "images", "pdf", "plainText", "ppt", "pptx", "video", "xls", "xlsx", "zip"]
  errorText: PropTypes.string,
  helpText: PropTypes.string,
  onError: PropTypes.func,
  onFileUpload: PropTypes.func,
};

FileUpload.defaultProps = {
  file: '',
  title: 'Upload',
  onError: () => {},
  onFileUpload: () => {},
};

export default FileUpload;
