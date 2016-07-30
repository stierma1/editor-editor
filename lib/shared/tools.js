import traverse from "traverse"
import {inspect} from "util"
var t = require("tcomb-form");

export function enumerableItemsToObject(enumItems){
  if(enumItems === null || enumItems === undefined){
    return undefined;
  }
  return enumItems.reduce(function(red, val){
    red[val.value] = val.display;
    return red;
  }, {})
}

export function mergeFieldActions(fieldActions, fetchStructure, fetchRefinement){
  var formSchema = {};
  var constructName = null;
  if(fieldActions.length > 0){
    constructName = fieldActions[0].value.constructName;
  }
  for(var actionObject of fieldActions){
    var actionItem = actionObject.value;
    if(actionObject.action === "add"){
      switch(actionItem.editor.type){
        case "t.String":
          formSchema[actionItem.editor.label] = t.String
          break;
        case "t.Number":
          formSchema[actionItem.editor.label] = t.Number
          break;
        case "t.Date":
          formSchema[actionItem.editor.label] = t.Date
          break;
        case "t.Boolean":
          formSchema[actionItem.editor.label] = t.Boolean
          break;
        case "t.list":
          formSchema[actionItem.editor.label] = t.list(fetchStructure(actionItem.editor.subtype))
          break;
        case "t.struct":
          formSchema[actionItem.editor.label] = fetchStructure(actionItem.editor.subtype)
          break;
        case "t.enums":
          formSchema[actionItem.editor.label] = t.enums(enumerableItemsToObject(actionItem.editor.enums), actionItem.editor.label)
          break;
        case "t.refinement":
          formSchema[actionItem.editor.label] = fetchRefinement(actionItem.editor.refinementType)
          break;
      }
      if(actionItem.editor.optional){
        formSchema[actionItem.editor.label] = t.maybe(formSchema[actionItem.editor.label]);
      }
    } else if(actionObject.action === "remove"){
      delete formSchema[actionItem.editor.label]
    }
  }

  return {constructName: constructName, schema:t.struct(formSchema)};
}

export function structureToActions(structure){
  console.log(inspect(structure))
}
