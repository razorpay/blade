import React from 'react';
import { storiesOf } from '@storybook/react';
import Space from '../../atoms/Space';
import View from '../../atoms/View';
import Flex from '../../atoms/Flex';
import FileUpload from '../FileUpload';

storiesOf('FileUpload', module)
  .addParameters({
    component: FileUpload,
  })
  .add('default', () => (
    <Flex flex={1} alignItems="center">
      <View>
        <Space margin={[1, 0]}>
          <View>
            <FileUpload
              onFileSelectionError={() => {}}
              onFileSelected={() => {}}
              helpText="File Upload Empty"
            />
          </View>
        </Space>
        <Space margin={[1, 0]}>
          <View>
            <FileUpload
              file="abc"
              title="Uploading file abc"
              progress={30}
              onFileSelectionError={() => {}}
              onFileSelected={() => {}}
              helpText="Uploading file with 30% progress"
            />
          </View>
        </Space>
        <Space margin={[1, 0]}>
          <View>
            <FileUpload
              file="abc"
              title="Uploaded the file"
              progress={100}
              onFileSelectionError={() => {}}
              onFileSelected={() => {}}
              helpText="Uploaded file with progress 100%"
            />
          </View>
        </Space>
        <Space margin={[1, 0]}>
          <View>
            <FileUpload
              file=""
              onFileSelectionError={() => {}}
              onFileSelected={() => {}}
              errorText="Error for not meeting the file constraints"
            />
          </View>
        </Space>
        <Space margin={[1, 0]}>
          <View>
            <FileUpload
              file="abc"
              title="Uploaded file abc"
              progress={100}
              onFileSelectionError={() => {}}
              onFileSelected={() => {}}
              errorText="Case where some server error occured"
            />
          </View>
        </Space>
      </View>
    </Flex>
  ));
