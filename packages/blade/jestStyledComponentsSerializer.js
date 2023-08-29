// For compatibility with jest v28+, we need to export the serializer as a function.
// See https://github.com/styled-components/jest-styled-components/issues/429
const serializer = require('jest-styled-components').styleSheetSerializer;

module.exports = serializer;
