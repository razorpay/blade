import type { StoryFn, Meta } from '@storybook/react';
import type { FileUploadProps } from './FileUpload';
import { FileUpload as FileUploadComponent } from './FileUpload';
import { Heading } from '~components/Typography/Heading';
import BaseBox from '~components/Box/BaseBox';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Text } from '~components/Typography/Text';
import { Card, CardBody } from '~components/Card';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { List, ListItem } from '~components/List';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="FileUpload"
      componentDescription="FileUpload is a visual element that is used to separate or divide content within a layout"
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=71106-265680&mode=design&t=jyVG8aXFc1Dlw2Se-4"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox>
        {`
          import {
            FileUpload,
            Box,
            Heading,
            Text,
            Card,
            CardBody
          } from "@razorpay/blade/components";
          
          function App(): React.ReactElement {
            const [file, setFile] = useState();

            const handleFileChange = ({ files }) => {
                setFile(files[0]);
            };

            const handleSubmit = async (e) => {
                e.preventDefault();

                // Create a FormData object to append files
                const formData = new FormData();
                formData.append('files', file);
                try {
                // Simulate a file upload using axios
                const response = await axios.post(
                    'https://run.mocky.io/v3/bb0b32f0-fc54-4d78-9c9b-08b3a4d8f7c5',
                    formData,
                    {
                    headers: {
                        'content-type': 'multipart/form-data',
                    },
                    },
                );

                // Handle success, reset form, etc.
                console.log('Files uploaded successfully:', response.data);
                } catch (error) {
                // Handle errors
                console.error('File upload failed:', error.message);
                }
            };

            return (
                <Box>
                <form onSubmit={handleSubmit}>
                  <FileUpload
                    label="GSTIN Certificate"
                    selectionType="single"
                    onChange={handleFileChange}
                    accept=".jpg, .png, .pdf"
                    helpText="Upload .jpg, .png, or .pdf file only"
                    onDrop={(e) => console.log('Files dropped!', e)}
                  />
          
                  <button type="submit">Submit</button>
                </form>
              </Box>
            );
          }
          export default App;          
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/FileUpload',
  component: FileUploadComponent,
  tags: ['autodocs'],
  argTypes: getStyledPropsArgTypes(),
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<FileUploadProps>;

const FileUploadDefaultTemplate: StoryFn<typeof FileUploadComponent> = (args) => {
  return (
    <Card>
      <CardBody>
        <BaseBox display="flex" flexDirection={args.orientation == 'vertical' ? 'row' : 'column'}>
          <Heading margin="spacing.4">Payment Links</Heading>
          <FileUploadComponent {...args} />
          <Box margin="spacing.4">
            <Text>Share payment link via:</Text>
            <List>
              <ListItem>Email</ListItem>
              <ListItem>SMS</ListItem>
              <ListItem>Messenger</ListItem>
            </List>
          </Box>
        </BaseBox>
      </CardBody>
    </Card>
  );
};

export const FileUpload = FileUploadDefaultTemplate.bind({});
FileUpload.storyName = 'Default';
