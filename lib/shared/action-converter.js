var plan = require('forward-chainer');
var t = require("tcomb-form");
var Immutable = require("immutable");

function toJS(obj){
  return (obj.toJS && obj.toJS()) || obj;
}

function link(expr1, expr2){
  if(expr1.canLink(expr2)){
    expr1.link(expr2);
  }
}



function mapDataTToEditor(dataT){
  var editor = {
    label:dataT._ref.key,
    optional: false,
    refinementType:null,
    restrictedItems:null,
    subtype:null,
    type:null
  }
  var next = dataT.links[0];
  var nextStruct = null;
  while(next){
    if(next instanceof StructT){
      if(!editor.type){
        editor.type = "t.struct"
      }
      editor.subtype = next.name;
      nextStruct = next;
      break;
    }
    else if(next instanceof MaybeT){
      editor.optional = true;
    }
    else if(next instanceof ListT){
      editor.type = "t.list";
    }
    else if(next instanceof StringT){
      editor.type = "t.String";
    }
    else if(next instanceof NumberT){
      editor.type = "t.Number";
    }
    else if(next instanceof BooleanT){
      editor.type = "t.Boolean";
    }
    else if(next instanceof DateT){
      editor.type = "t.Date";
    }
    else if(next instanceof RefinementT){
      editor.refinementType = next.name;
      editor.type = "t.refinement";
    }
    else if(next instanceof EnumsT){
      editor.type = "t.enums";
      editor.restrictedItems = next.enums;
    } else {
      throw new Error("Unknown type")
    }
    next = next.links[0];
  }

  return {editor, nextStruct}
}

function mapAbstractToActions(abstractsArray){
  var struct = abstractsArray[0];
  return _mapAbstractToActions(struct, struct.name);
}

function _mapAbstractToActions(struct, name){
  var nexts = struct.links;
  var nextStructs = [];
  var actions = nexts.map((dataT) => {
    var {editor, nextStruct} = mapDataTToEditor(dataT)
    var action = {
      action:"add",
      value: {
        constructName: name,
        editor: editor
      }
    }
    if(nextStruct){
      nextStructs.push(nextStruct);
    }
    return action;
  });
  for(var structObj of nextStructs){
    actions = actions.concat(_mapAbstractToActions(structObj, structObj.name));
  }

  return actions;
}

class DataT{
  constructor(obj){
    if(!obj.key || !obj.value){
      this._failed = true;
    }
    this._ref = obj;
    this.links = [];
  }

  getNextNodes(){
    return [this._ref.value];
  }

  canLink(expression){
    var nodes = this.getNextNodes();
    return nodes.filter((node) => {
      return node === expression._ref
    }).length > 0
  }

  link(expression){
    this.links.push(expression);
    return this;
  }
}

class StructT{
  constructor(obj){
    if(!obj.meta || obj.meta.kind !== "struct"){
      this._failed = true;
    }
    this._ref = obj;
    this.name = obj && obj.meta && obj.meta.name;
    this.links = [];
  }

  getNextNodes(){
    var nodes = [];
    for(var i in this._ref.meta.props){
      nodes.push({value:this._ref.meta.props[i], key:i});
    }
    return nodes;
  }

  canLink(expression){
    var nodes = this.getNextNodes();
    return nodes.filter((node) => {
      return expression instanceof DataT && node.value === expression._ref.value
    }).length > 0
  }

  link(expression){
    this.links.push(expression);
    return this;
  }
}

class ListT{
  constructor(obj){
    if(!obj.meta || obj.meta.kind !== "list"){
      this._failed = true;
    }
    this._ref = obj;
    this.links = [];
  }

  getNextNodes(){
    return [this._ref.meta.type];
  }

  canLink(expression){
    var nodes = this.getNextNodes();
    return nodes.filter((node) => {
      return node === expression._ref
    }).length > 0
  }

  link(expression){
    this.links.push(expression);
    return this;
  }
}

class RefinementT{
  constructor(obj){
    if(!obj.meta || obj.meta.kind !== "subtype"){
      this._failed = true;
    }
    this._ref = obj;
    this.name = obj.meta && obj.meta.name;
    this.links = [];
  }

  getNextNodes(){
    return [this._ref.meta.type];
  }

  canLink(expression){
    var nodes = this.getNextNodes();
    return nodes.filter((node) => {
      return node.value === expression._ref
    }).length > 0
  }
}

class MaybeT{
  constructor(obj){
    if(!obj.meta || obj.meta.kind !== "maybe"){
      this._failed = true;
    }
    this._ref = obj;
    this.links = [];
  }

  getNextNodes(){
    return [this._ref.meta.type];
  }

  canLink(expression){
    var nodes = this.getNextNodes();
    return nodes.filter((node) => {
      return node === expression._ref
    }).length > 0
  }

  link(expression){
    this.links.push(expression)
  }
}

class EnumsT{
  constructor(obj){
    if(!obj.meta || obj.meta.kind !== "enums"){
      this._failed = true;
      return;
    }
    this.enums = obj.meta.map;
    this.name = obj.meta.name;
    this._ref = obj;
    this.links = [];
  }

  getNextNodes(){
    return [];
  }

  canLink(){
    return false;
  }
}

class StringT{
  constructor(obj){
    if(!obj.meta || obj.meta.kind !== "irreducible" || obj.meta.name !== "String"){
      this._failed = true;
    }
    this._ref = obj;
    this.links = [];
  }

  getNextNodes(){
    return [];
  }

  canLink(){
    return false;
  }
}

class NumberT{
  constructor(obj){
    if(!obj.meta || obj.meta.kind !== "irreducible" || obj.meta.name !== "Number"){
      this._failed = true;
    }
    this._ref = obj;
    this.links = [];
  }

  getNextNodes(){
    return [];
  }

  canLink(){
    return false;
  }
}

class BooleanT{
  constructor(obj){
    if(!obj.meta || obj.meta.kind !== "irreducible" || obj.meta.name !== "Boolean"){
      this._failed = true;
    }
    this._ref = obj;
    this.links = [];
  }

  getNextNodes(){
    return [];
  }

  canLink(){
    return false;
  }
}

class DateT{
  constructor(obj){
    if(!obj.meta || obj.meta.kind !== "irreducible" || obj.meta.name !== "Boolean"){
      this._failed = true;
    }
    this._ref = obj;
    this.links = [];
  }

  getNextNodes(){
    return [];
  }

  canLink(){
    return false;
  }
}

function possibleClosure(constructor){
  return function(state){
    var workNodes = state.get("work");
    if(workNodes.size === 0){
      return false;
    }
    var workNode = workNodes.last();
    return !new constructor(toJS(workNode))._failed;
  }
}

function updateClosure(constructor){
  return function(state){
    var workNodes = state.get("work");
    var workNode = workNodes.last();
    workNodes = workNodes.pop();
    var data = new constructor(toJS(workNode));
    var classifiedNodes = state.get("classified");
    classifiedNodes = classifiedNodes.push(data);
    state = state.set("classified", classifiedNodes);
    workNodes = workNodes.concat(data.getNextNodes());
    state = state.set("work", workNodes);
    return state;
  }
}

var actions = [{
  id:"data",
  possible:possibleClosure(DataT),
  updateState:updateClosure(DataT)
  },
  {
  id:"struct",
  possible:possibleClosure(StructT),
  updateState:updateClosure(StructT)
  },
  {
id:"list",
possible:possibleClosure(ListT),
updateState:updateClosure(ListT)
},{
id:"refinement",
possible:possibleClosure(RefinementT),
updateState:updateClosure(RefinementT)
},{
id:"maybe",
possible:possibleClosure(MaybeT),
updateState:updateClosure(MaybeT)
},{
id:"enums",
possible:possibleClosure(EnumsT),
updateState:updateClosure(EnumsT)
},{
  id:"string",
  possible:possibleClosure(StringT),
  updateState:updateClosure(StringT)
},{
  id:"number",
  possible:possibleClosure(NumberT),
  updateState:updateClosure(NumberT)
},{
  id:"boolean",
  possible:possibleClosure(BooleanT),
  updateState:updateClosure(BooleanT)
},
{
  id:"date",
  possible:possibleClosure(DateT),
  updateState:updateClosure(DateT)
}]

var positive = t.refinement(t.Num, (x) => {return x > 0}, "positive")
var form = t.struct({
  name:t.Str,
  address:t.Str,
  bacon:t.Num,
  ham:t.list(t.struct({
    last:t.maybe(positive)
  }, "ham3"))
}, "bacon")

var matchGen = plan(actions, {classified:[new StructT(form)], work:new StructT(form).getNextNodes()}, (state) => {
  return state.get("work").size === 0;
},1000)

var match = matchGen.next();
if(match.value){
  var last = toJS(match.value[match.value.length -1].state);

  for(var expr1 of last.classified){
    for(var expr2 of last.classified){
      link(expr1, expr2);
    }
  }
  mapAbstractToActions(last.classified).map(function(action){
    console.log(action.value.editor)
  })
  console.log(mapAbstractToActions(last.classified))
}

//console.log(JSON.stringify(toJS(last.state), null, 2))
