module.exports = function buildManifest(manifest) {
  return {
    ...manifest,
    permissions: ['currentuser'],
  };
};
