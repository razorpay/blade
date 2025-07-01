const fs = require('fs');
const path = require('path');

// Path to your SVG file
const filePath = path.join(__dirname, 'input.svg');

// Read the SVG file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Replace " with \"
  const updatedData = data.replace(/"/g, '\\"');

  // Write the updated content back to the file or a new file
  const outputFilePath = path.join(__dirname, 'output.svg');
  fs.writeFile(outputFilePath, updatedData, (writeErr) => {
    if (writeErr) {
      console.error('Error writing the file:', writeErr);
      return;
    }

    console.log('File updated successfully and saved as output.svg');
  });
});