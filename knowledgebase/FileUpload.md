## Component Name
FileUpload

## Description
The FileUpload component is used to handle file attachments, including drag-and-drop interactions. It supports both single and multiple file uploads, with built-in validation for file types, sizes, and counts. The component can operate in controlled or uncontrolled modes, making it versatile for various scenarios from simple form inputs to complex upload workflows with progress indicators and previews.

## TypeScript Types
The following types represent the props that the FileUpload component accepts. These allow you to properly configure the component according to your needs.

```typescript
/**
 * Props for the FileUpload component
 */
type FileUploadProps = {
  /**
   * The upload type - single or multiple files
   * @default 'single'
   */
  uploadType?: 'single' | 'multiple';

  /**
   * Label for the upload component
   */
  label?: string;

  /**
   * Additional help text below the component
   */
  helpText?: string;

  /**
   * Error text to display when validation fails
   */
  errorText?: string;

  /**
   * Success text to display after successful upload
   */
  successText?: string;

  /**
   * Accepted file types (e.g., '.jpg, .png, .pdf')
   */
  accept?: string;

  /**
   * Maximum number of files allowed
   */
  maxCount?: number;

  /**
   * Maximum size of each file in bytes
   */
  maxSize?: number;

  /**
   * List of files (for controlled component)
   */
  fileList?: BladeFileList;

  /**
   * Whether to disable the component
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Whether the field is required
   * @default false
   */
  isRequired?: boolean;

  /**
   * Indicator for required/optional state
   * @default 'none'
   */
  necessityIndicator?: 'required' | 'optional' | 'none';

  /**
   * Callback when files are selected through the input or dropped
   */
  onChange?: (info: { fileList: BladeFileList }) => void;

  /**
   * Callback when files are dropped on the dropzone
   */
  onDrop?: (info: { fileList: BladeFileList }) => void;

  /**
   * Callback when the preview button is clicked
   */
  onPreview?: (info: { file: BladeFile }) => void;

  /**
   * Callback when the remove button is clicked
   */
  onRemove?: (info: { file: BladeFile; fileList: BladeFileList }) => void;

  /**
   * Callback when file upload is started
   */
  onUpload?: (info: { file: BladeFile; fileList: BladeFileList }) => void;

  /**
   * Validation state of the component
   * @default 'none'
   */
  validationState?: 'error' | 'success' | 'none';

  /**
   * Size variant of the component
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Position of the label
   * @default 'top'
   */
  labelPosition?: 'top' | 'left';
} & StyledPropsBlade & TestID;

/**
 * File object for the FileUpload component
 */
type BladeFile = File & {
  /**
   * Unique identifier for the file
   */
  id: string;

  /**
   * Status of the file upload
   */
  status?: 'uploading' | 'success' | 'error';

  /**
   * Error text to display when upload fails
   */
  errorText?: string;

  /**
   * Upload progress percentage (0-100)
   */
  progress?: number;

  /**
   * Whether to show the file preview
   */
  showPreview?: boolean;

  /**
   * URL for file preview (if available)
   */
  previewUrl?: string;
};

/**
 * List of BladeFile objects
 */
type BladeFileList = BladeFile[];

/**
 * Type for test ID
 */
type TestID = {
  /**
   * ID used for testing
   */
  testID?: string;
};

/**
 * Styled props for blade components
 */
type StyledPropsBlade = {
  // Various styling props like margin, padding, etc.
};
```

## Examples

### Single File Upload with Form

A basic example of single file upload integrated in a form with validation.

```tsx
import React, { useState } from 'react';
import { FileUpload, TextInput, Button, Box } from '@razorpay/blade/components';

const SingleFileUploadExample = () => {
  const [name, setName] = useState('');
  const [fileList, setFileList] = useState([]);
  const [validationState, setValidationState] = useState('none');
  
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
    
    // Simple validation based on whether files are selected
    if (fileList.length > 0) {
      setValidationState('success');
    } else {
      setValidationState('none');
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Form submitted: Name: ${name}, File: ${fileList[0]?.name || 'None'}`);
  };

  return (
    <Box padding="spacing.4">
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Name"
          value={name}
          onChange={({ value }) => setName(value)}
          marginBottom="spacing.3"
          isRequired
        />
        
        <FileUpload
          uploadType="single"
          label="Profile Image"
          helpText="Upload a profile picture (JPEG or PNG, max 2MB)"
          accept=".jpg,.jpeg,.png"
          maxSize={2 * 1024 * 1024}
          isRequired
          validationState={validationState}
          errorText="Please upload a valid image file"
          successText="File uploaded successfully"
          fileList={fileList}
          onChange={handleFileChange}
          onRemove={() => {
            setFileList([]);
            setValidationState('none');
          }}
          marginBottom="spacing.3"
        />
        
        <Button 
          type="submit" 
          isDisabled={!name || fileList.length === 0}
        >
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default SingleFileUploadExample;
```

### Multiple File Upload

An example showing how to use the multiple file upload functionality with progress indicators.

```tsx
import React, { useState } from 'react';
import { FileUpload, Box } from '@razorpay/blade/components';
import type { BladeFile, BladeFileList } from '@razorpay/blade/components';

const MultipleFileUploadExample = () => {
  const [fileList, setFileList] = useState<BladeFileList>([]);
  
  // Simulate file upload with progress
  const simulateUpload = (file: BladeFile) => {
    // Set initial uploading state
    setFileList(prevList => 
      prevList.map(f => 
        f.id === file.id ? { ...f, status: 'uploading', progress: 0 } : f
      )
    );
    
    // Simulate progress with intervals
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      
      if (progress <= 100) {
        // Update progress
        setFileList(prevList => 
          prevList.map(f => 
            f.id === file.id ? { ...f, progress } : f
          )
        );
      } else {
        // Complete the upload
        clearInterval(interval);
        setFileList(prevList => 
          prevList.map(f => 
            f.id === file.id ? { ...f, status: 'success' } : f
          )
        );
      }
    }, 500);
  };
  
  const handleFileChange = ({ fileList: newFileList }) => {
    // Find files that need to be uploaded (no status)
    const filesToUpload = newFileList.filter(file => !file.status);
    
    // Update file list first
    setFileList(newFileList);
    
    // Start simulated upload for new files
    filesToUpload.forEach(simulateUpload);
  };
  
  return (
    <Box padding="spacing.4">
      <FileUpload
        uploadType="multiple"
        label="Document Upload"
        helpText="Upload up to 3 documents (PDF or DOC, max 5MB each)"
        accept=".pdf,.doc,.docx"
        maxCount={3}
        maxSize={5 * 1024 * 1024}
        fileList={fileList}
        onChange={handleFileChange}
        onRemove={({ fileList: updatedList }) => setFileList(updatedList)}
        size="medium"
      />
    </Box>
  );
};

export default MultipleFileUploadExample;
``` 