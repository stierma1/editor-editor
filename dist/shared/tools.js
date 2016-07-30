"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enumerableItemsToObject = enumerableItemsToObject;
exports.mergeFieldActions = mergeFieldActions;
exports.structureToActions = structureToActions;

var _traverse = require("traverse");

var _traverse2 = _interopRequireDefault(_traverse);

var _util = require("util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var t = require("tcomb-form");

function enumerableItemsToObject(enumItems) {
  if (enumItems === null || enumItems === undefined) {
    return undefined;
  }
  return enumItems.reduce(function (red, val) {
    red[val.value] = val.display;
    return red;
  }, {});
}

function mergeFieldActions(fieldActions, fetchStructure, fetchRefinement) {
  var formSchema = {};
  var constructName = null;
  if (fieldActions.length > 0) {
    constructName = fieldActions[0].value.constructName;
  }
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = fieldActions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var actionObject = _step.value;

      var actionItem = actionObject.value;
      if (actionObject.action === "add") {
        switch (actionItem.editor.type) {
          case "t.String":
            formSchema[actionItem.editor.label] = t.String;
            break;
          case "t.Number":
            formSchema[actionItem.editor.label] = t.Number;
            break;
          case "t.Date":
            formSchema[actionItem.editor.label] = t.Date;
            break;
          case "t.Boolean":
            formSchema[actionItem.editor.label] = t.Boolean;
            break;
          case "t.list":
            formSchema[actionItem.editor.label] = t.list(fetchStructure(actionItem.editor.subtype));
            break;
          case "t.struct":
            formSchema[actionItem.editor.label] = fetchStructure(actionItem.editor.subtype);
            break;
          case "t.enums":
            formSchema[actionItem.editor.label] = t.enums(enumerableItemsToObject(actionItem.editor.enums), actionItem.editor.label);
            break;
          case "t.refinement":
            formSchema[actionItem.editor.label] = fetchRefinement(actionItem.editor.refinementType);
            break;
        }
        if (actionItem.editor.optional) {
          formSchema[actionItem.editor.label] = t.maybe(formSchema[actionItem.editor.label]);
        }
      } else if (actionObject.action === "remove") {
        delete formSchema[actionItem.editor.label];
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return { constructName: constructName, schema: t.struct(formSchema) };
}

function structureToActions(structure) {
  console.log((0, _util.inspect)(structure));
}