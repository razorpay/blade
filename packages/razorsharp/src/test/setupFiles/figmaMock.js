module.exports.codegen = {
  preferences: {
    customSettings: {},
  },
};

module.exports.figma = {
  codegen: module.exports.codegen,
};

global.figma = module.exports.figma;
