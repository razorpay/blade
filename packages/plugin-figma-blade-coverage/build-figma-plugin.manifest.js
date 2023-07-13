require('dotenv').config();
module.exports = function buildManifest(manifest) {
  return {
    ...manifest,
    id: process.env.FIGMA_PLUGIN_ID,
    permissions: ['currentuser'],
  };
};
