import { FileUploadProps, BladeFile, BladeFileList } from './types';
import { BladeElementRef } from '../../utils/types';
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
declare const FileUpload: import('react').ForwardRefExoticComponent<FileUploadProps & import('react').RefAttributes<BladeElementRef>>;
export { FileUpload };
export type { BladeFile, BladeFileList, FileUploadProps };
