# FileUpload Decisions <!-- omit in toc -->

Form field used for handling file attachments including the drag-and-drop interaction.

This document outlines the API details of the `FileUpload` & `FileUploadItem` components, encompassing their structural composition, functional attributes, and visual representation.

<img width="100%" src="./single-upload-variant.png" alt="Single File Upload">
<img width="100%" src="./multiple-upload-variant.png" alt="Multiple Files Upload">
<img width="100%" src="./file-upload-item-variants.png" alt="FileUploadItem Variants ">

- [Design](#design)
- [Anatomy](#anatomy)
- [`FileUpload` API](#fileupload-api)
- [`FileUploadItem` API](#fileuploaditem-api)
- [Examples](#examples)
  - [Uncontrolled Usage](#uncontrolled-usage)
    - [Single File selection](#single-file-selection)
    - [Multiple File selection:](#multiple-file-selection)
    - [With custom upload progress](#with-custom-upload-progress)
  - [Controlled Usage](#controlled-usage)
    - [Single File selection](#single-file-selection-1)
    - [Multiple File selection:](#multiple-file-selection-1)
    - [With custom upload progress](#with-custom-upload-progress-1)
- [Accessibility](#accessibility)

## Design

[Figma Link](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=78150%3A2625&mode=design&t=bKQvPInRmAoeAAFV-1) to all variants of the `FileUpload` component.

## Anatomy

<img width="100%" src="./file-upload-anatomy.png" alt="Single File Upload">
<img width="100%" src="./file-upload-item-anatomy.png" alt="Multiple Files Upload">

## `FileUpload` API

| Prop                   | Type                                  | Default    | Description                                                                                                                                  | Required |
| ---------------------- | ------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| **label**              | `string`                              | `-`        | Label for the FileUpload component                                                                                                           | ❌       |
| **accessibilityLabel** | `string`                              | `-`        | Accessibility label for the FileUpload component                                                                                             | ✅       |
| **labelPosition**      | `'top' \| 'left'`                     | `'top'`    | Position of the label relative to the file upload area. Desktop only prop. Default value on mobile will be `'top'`                           | ❌       |
| **accept**             | `string`                              | `-`        | File types that can be accepted. See [input's accept attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept) | ❌       |
| **isDisabled**         | `boolean`                             | `false`    | Disables or enables the FileUpload component.                                                                                                | ❌       |
| **name**               | `string`                              | `-`        | The name of the file upload input, [useful in form submissions](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name)        | ❌       |
| **selectionType**      | `'single' \| 'multiple'`              | `'single'` | Defines the selection behavior within the FileUpload component                                                                               | ❌       |
| **defaultFileList**    | `fileList`                            | `-`        | Default list of files that have been uploaded                                                                                                | ❌       |
| **hideSelectedFiles**  | `boolean`                             | `false`    | Determines whether to display selected files. Set to `true` when customizing the upload process and managing progress independently.         | ❌       |
| **fileList**           | `string \|string[]`                   | `-`        | List of files that have been uploaded (controlled)                                                                                           | ❌       |
| **maxCount**           | `number`                              | `-`        | Limit the number of uploaded files                                                                                                           | ❌       |
| **maxSize**            | `number`                              | `-`        | Limit the size of the uploaded files (in bytes)                                                                                              | ❌       |
| **onChange**           | `({ name, fileList }) => void`        | `-`        | Callback function triggered when files are selected                                                                                          | ❌       |
| **onDrop**             | `(event: React.DragEvent) => void`    | `-`        | Callback function executed when files are dropped into the upload area                                                                       | ❌       |
| **onRemove**           | `({ removedFile, fileList }) => void` | `-`        | Callback function triggered when a file is removed                                                                                           | ❌       |
| **validationState**    | `'none' \| 'error'`                   | `-`        | State indicating whether there is an error in the FileUpload component                                                                       | ❌       |
| **helpText**           | `string`                              | `-`        | Additional text providing assistance or guidance                                                                                             | ❌       |
| **errorText**          | `string`                              | `-`        | Text indicating an error state                                                                                                               | ❌       |


## `FileUploadItem` API

| Prop                | Type                                  | Default | Description                                                  | Required |
| ------------------- | ------------------------------------- | ------- | ------------------------------------------------------------ | -------- |
| **fileName**        | `string`                              | `-`     | Name of the uploaded file                                    | ✅       |
| **fileSize**        | `'single' \| 'multiple'`              | `-`     | Size of the uploaded file                                    | ✅       |
| **onRemove**        | `({ file }) => void`                  | `-`     | Callback function triggered when the file is removed         | ✅       |
| **uploadState**     | `'uploading' \| 'success' \| 'error'` | `-`     | State indicating the upload status                           | ✅       |
| **percent**         | `number`                              | `-`     | Percentage of file upload completion                         | ❌       |
| **showPreviewIcon** | `boolean`                             | `false` | Percentage of file upload completion                         | ❌       |
| **onPreview**       | `(file) => void`                      | `-`     | Callback function triggered when the preview icon is clicked | ❌       |

## Examples

Here are a few illustrative examples showcasing the utilization of the `FileUpload` and `FileUploadItem` components:

### Uncontrolled Usage

#### Single File selection

```jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Box, FileUpload, FileUploadItem } from '@razorpay/blade/components';

const UncontrolledSingleFileUploadForm = () => {
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
    <div>
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
    </div>
  );
};

export default UncontrolledSingleFileUploadForm;
```

#### Multiple File selection:

```jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Box, FileUpload, FileUploadItem } from '@razorpay/blade/components';

const UncontrolledMultiFileUploadForm = () => {
  const [files, setFiles] = useState();

  const handleFileChange = ({ files }) => {
    setFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to append files
    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append(`file-${index}`, file);
    });

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
    <div>
      <form onSubmit={handleSubmit}>
        <FileUpload
          label="GSTIN Certificate"
          selectionType="multiple"
          onChange={handleFileChange}
          accept=".jpg, .png, .pdf"
          helpText="Upload .jpg, .png, or .pdf files only"
          onDrop={(e) => console.log('Files dropped!', e)}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UncontrolledMultiFileUploadForm;
```

#### With custom upload progress

```jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Box, FileUpload, FileUploadItem } from '@razorpay/blade/components';

const UncontrolledCustomProgressFileUploadForm = () => {
  const [file, setFile] = useState();
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploadState, setUploadState] = useState();
  const [uploadedFile, setUploadedFile] = useState();

  const handleFileChange = ({ files }) => {
    setFile(files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to append files
    const formData = new FormData();

    formData.append('files', file);
    setUploadedFile(file);

    try {
      // Simulate a file upload using axios
      const response = await axios.post(
        'https://run.mocky.io/v3/bb0b32f0-fc54-4d78-9c9b-08b3a4d8f7c5',
        formData,
        {
          headers: {
            'content-type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadPercent(percentCompleted);

            if (percentCompleted === 100) {
              setUploadState('success');
            } else {
              setUploadState('uploading');
            }
          },
        },
      );

      // Handle success, reset form, etc.
      console.log('Files uploaded successfully:', response.data);
    } catch (error) {
      // Handle errors
      setUploadState('error');
      console.error('File upload failed:', error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FileUpload
          label="GSTIN Certificate"
          selectionType="single"
          onChange={handleFileChange}
          hideSelectedFiles={true}
          accept=".jpg, .png, .pdf"
          helpText="Upload .jpg, .png, or .pdf files only"
          onDrop={(e) => console.log('Files dropped!', e)}
        />

        {uploadState && uploadedFile && (
          <FileUploadItem
            fileName={uploadedFile.name}
            fileSize={uploadedFile.size}
            uploadState={uploadState}
            percent={uploadPercent}
          />
        )}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UncontrolledCustomProgressFileUploadForm;
```

### Controlled Usage

#### Single File selection

```jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Box, FileUpload, FileUploadItem } from '@razorpay/blade/components';

const ControlledSingleFileUploadForm = () => {
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
    <div>
      <form onSubmit={handleSubmit}>
        <FileUpload
          label="GSTIN Certificate"
          selectionType="single"
          fileList={file}
          onChange={handleFileChange}
          accept=".jpg, .png, .pdf"
          helpText="Upload .jpg, .png, or .pdf file only"
          onDrop={(e) => console.log('Files dropped!', e)}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ControlledSingleFileUploadForm;
```

#### Multiple File selection:

```jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Box, FileUpload, FileUploadItem } from '@razorpay/blade/components';

const ControlledMultiFileUploadForm = () => {
  const [files, setFiles] = useState();

  const handleFileChange = ({ files }) => {
    setFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to append files
    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append(`file-${index}`, file);
    });

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
    <div>
      <form onSubmit={handleSubmit}>
        <FileUpload
          label="GSTIN Certificate"
          selectionType="multiple"
          fileList={files}
          onChange={handleFileChange}
          accept=".jpg, .png, .pdf"
          helpText="Upload .jpg, .png, or .pdf files only"
          onDrop={(e) => console.log('Files dropped!', e)}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
```

#### With custom upload progress

```jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Box, FileUpload, FileUploadItem } from '@razorpay/blade/components';

const ControlledCustomProgressFileUploadForm = () => {
  const [file, setFile] = useState();
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploadState, setUploadState] = useState();
  const [uploadedFile, setUploadedFile] = useState();

  const handleFileChange = ({ files }) => {
    setFile(files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to append files
    const formData = new FormData();

    formData.append('files', file);
    setUploadedFile(file);

    try {
      // Simulate a file upload using axios
      const response = await axios.post(
        'https://run.mocky.io/v3/bb0b32f0-fc54-4d78-9c9b-08b3a4d8f7c5',
        formData,
        {
          headers: {
            'content-type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadPercent(percentCompleted);

            if (percentCompleted === 100) {
              setUploadState('success');
            } else {
              setUploadState('uploading');
            }
          },
        },
      );

      // Handle success, reset form, etc.
      console.log('Files uploaded successfully:', response.data);
    } catch (error) {
      // Handle errors
      setUploadState('error');
      console.error('File upload failed:', error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FileUpload
          label="GSTIN Certificate"
          selectionType="single"
          fileList={file}
          onChange={handleFileChange}
          hideSelectedFiles={true}
          accept=".jpg, .png, .pdf"
          helpText="Upload .jpg, .png, or .pdf files only"
          onDrop={(e) => console.log('Files dropped!', e)}
        />

        {uploadState && uploadedFile && (
          <FileUploadItem
            fileName={uploadedFile.name}
            fileSize={uploadedFile.size}
            uploadState={uploadState}
            percent={uploadPercent}
          />
        )}

        <button type="submit">Submit</button>
      </form>
    </
```

## Accessibility

- The component accepts an `accessibilityLabel` prop to let users pass an `aria-label` used by screen readers.
- When the input is in focus, the `FileUpload` component will display a focus ring around the input area to indicate the current focus state. Using `Space` and `Enter` keys can be used to open the file picker dialog.
