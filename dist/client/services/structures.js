"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchStructure = fetchStructure;
exports.addStructure = addStructure;

var structures = {};
var enumeratedStructures = {};
function updateEnumeration() {
  for (var key in structures) {
    enumeratedStructures[key] = key;
  }
}
exports.enumeratedStructures = enumeratedStructures;
function fetchStructure(key) {
  return structures[key];
}

function addStructure(key, value) {
  structures[key] = value;
  updateEnumeration();
}