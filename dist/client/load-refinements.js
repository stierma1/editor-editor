"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enumeratedRefinements = undefined;
exports.fetchRefinement = fetchRefinement;

var _coreRefinements = require("../shared/core-refinements");

var coreRefinements = _interopRequireWildcard(_coreRefinements);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var enumeratedRefinements = {};
for (var key in coreRefinements) {
  enumeratedRefinements[key] = key;
}

exports.enumeratedRefinements = enumeratedRefinements;
function fetchRefinement(key) {
  return coreRefinements[key];
}