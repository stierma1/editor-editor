"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var plan = require('forward-chainer');
var t = require("tcomb-form");
var Immutable = require("immutable");

function toJS(obj) {
  return obj.toJS && obj.toJS() || obj;
}

function link(expr1, expr2) {
  if (expr1.canLink(expr2)) {
    expr1.link(expr2);
  }
}

function mapDataTToEditor(dataT) {
  var editor = {
    label: dataT._ref.key,
    optional: false,
    refinementType: null,
    restrictedItems: null,
    subtype: null,
    type: null
  };
  var next = dataT.links[0];
  var nextStruct = null;
  while (next) {
    if (next instanceof StructT) {
      if (!editor.type) {
        editor.type = "t.struct";
      }
      editor.subtype = editor.label;
      nextStruct = next;
      break;
    } else if (next instanceof MaybeT) {
      editor.optional = true;
    } else if (next instanceof ListT) {
      editor.type = "t.list";
    } else if (next instanceof StringT) {
      editor.type = "t.String";
    } else if (next instanceof NumberT) {
      editor.type = "t.Number";
    } else if (next instanceof BooleanT) {
      editor.type = "t.Boolean";
    } else if (next instanceof DateT) {
      editor.type = "t.Date";
    } else if (next instanceof RefinementT) {
      editor.refinementType = next.name;
      editor.type = "t.refinement";
    } else if (next instanceof EnumsT) {
      editor.type = "t.enums";
      editor.restrictedItems = next.enums;
    } else {
      throw new Error("Unknown type");
    }
    next = next.links[0];
  }

  return { editor: editor, nextStruct: nextStruct };
}

function mapAbstractToActions(abstractsArray) {
  var struct = abstractsArray[0];
  return _mapAbstractToActions(struct, struct.name);
}

function _mapAbstractToActions(struct, name) {
  var nexts = struct.links;
  var nextStructs = [];
  var actions = nexts.map(function (dataT) {
    var _mapDataTToEditor = mapDataTToEditor(dataT);

    var editor = _mapDataTToEditor.editor;
    var nextStruct = _mapDataTToEditor.nextStruct;

    var action = {
      action: "add",
      value: {
        constructName: name,
        editor: editor
      }
    };
    if (nextStruct) {
      nextStructs.push(nextStruct);
    }
    return action;
  });
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = nextStructs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var structObj = _step.value;

      actions = actions.concat(_mapAbstractToActions(structObj, structObj.name));
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

  return actions;
}

var DataT = function () {
  function DataT(obj) {
    _classCallCheck(this, DataT);

    if (!obj.key || !obj.value) {
      this._failed = true;
    }
    this._ref = obj;
    this.links = [];
  }

  _createClass(DataT, [{
    key: "getNextNodes",
    value: function getNextNodes() {
      return [this._ref.value];
    }
  }, {
    key: "canLink",
    value: function canLink(expression) {
      var nodes = this.getNextNodes();
      return nodes.filter(function (node) {
        return node === expression._ref;
      }).length > 0;
    }
  }, {
    key: "link",
    value: function link(expression) {
      this.links.push(expression);
      return this;
    }
  }]);

  return DataT;
}();

var StructT = function () {
  function StructT(obj) {
    _classCallCheck(this, StructT);

    if (!obj.meta || obj.meta.kind !== "struct") {
      this._failed = true;
    }
    this._ref = obj;
    this.name = obj && obj.meta && obj.meta.name;
    this.links = [];
  }

  _createClass(StructT, [{
    key: "getNextNodes",
    value: function getNextNodes() {
      var nodes = [];
      for (var i in this._ref.meta.props) {
        nodes.push({ value: this._ref.meta.props[i], key: i });
      }
      return nodes;
    }
  }, {
    key: "canLink",
    value: function canLink(expression) {
      var nodes = this.getNextNodes();
      return nodes.filter(function (node) {
        return expression instanceof DataT && node.value === expression._ref.value;
      }).length > 0;
    }
  }, {
    key: "link",
    value: function link(expression) {
      this.links.push(expression);
      return this;
    }
  }]);

  return StructT;
}();

var ListT = function () {
  function ListT(obj) {
    _classCallCheck(this, ListT);

    if (!obj.meta || obj.meta.kind !== "list") {
      this._failed = true;
    }
    this._ref = obj;
    this.links = [];
  }

  _createClass(ListT, [{
    key: "getNextNodes",
    value: function getNextNodes() {
      return [this._ref.meta.type];
    }
  }, {
    key: "canLink",
    value: function canLink(expression) {
      var nodes = this.getNextNodes();
      return nodes.filter(function (node) {
        return node === expression._ref;
      }).length > 0;
    }
  }, {
    key: "link",
    value: function link(expression) {
      this.links.push(expression);
      return this;
    }
  }]);

  return ListT;
}();

var RefinementT = function () {
  function RefinementT(obj) {
    _classCallCheck(this, RefinementT);

    if (!obj.meta || obj.meta.kind !== "subtype") {
      this._failed = true;
    }
    this._ref = obj;
    this.name = obj.meta && obj.meta.name;
    this.links = [];
  }

  _createClass(RefinementT, [{
    key: "getNextNodes",
    value: function getNextNodes() {
      return [this._ref.meta.type];
    }
  }, {
    key: "canLink",
    value: function canLink(expression) {
      var nodes = this.getNextNodes();
      return nodes.filter(function (node) {
        return node.value === expression._ref;
      }).length > 0;
    }
  }]);

  return RefinementT;
}();

var MaybeT = function () {
  function MaybeT(obj) {
    _classCallCheck(this, MaybeT);

    if (!obj.meta || obj.meta.kind !== "maybe") {
      this._failed = true;
    }
    this._ref = obj;
    this.links = [];
  }

  _createClass(MaybeT, [{
    key: "getNextNodes",
    value: function getNextNodes() {
      return [this._ref.meta.type];
    }
  }, {
    key: "canLink",
    value: function canLink(expression) {
      var nodes = this.getNextNodes();
      return nodes.filter(function (node) {
        return node === expression._ref;
      }).length > 0;
    }
  }, {
    key: "link",
    value: function link(expression) {
      this.links.push(expression);
    }
  }]);

  return MaybeT;
}();

var EnumsT = function () {
  function EnumsT(obj) {
    _classCallCheck(this, EnumsT);

    if (!obj.meta || obj.meta.kind !== "enums") {
      this._failed = true;
      return;
    }
    this.enums = obj.meta.map;
    this.name = obj.meta.name;
    this._ref = obj;
    this.links = [];
  }

  _createClass(EnumsT, [{
    key: "getNextNodes",
    value: function getNextNodes() {
      return [];
    }
  }, {
    key: "canLink",
    value: function canLink() {
      return false;
    }
  }]);

  return EnumsT;
}();

var StringT = function () {
  function StringT(obj) {
    _classCallCheck(this, StringT);

    if (!obj.meta || obj.meta.kind !== "irreducible" || obj.meta.name !== "String") {
      this._failed = true;
    }
    this._ref = obj;
    this.links = [];
  }

  _createClass(StringT, [{
    key: "getNextNodes",
    value: function getNextNodes() {
      return [];
    }
  }, {
    key: "canLink",
    value: function canLink() {
      return false;
    }
  }]);

  return StringT;
}();

var NumberT = function () {
  function NumberT(obj) {
    _classCallCheck(this, NumberT);

    if (!obj.meta || obj.meta.kind !== "irreducible" || obj.meta.name !== "Number") {
      this._failed = true;
    }
    this._ref = obj;
    this.links = [];
  }

  _createClass(NumberT, [{
    key: "getNextNodes",
    value: function getNextNodes() {
      return [];
    }
  }, {
    key: "canLink",
    value: function canLink() {
      return false;
    }
  }]);

  return NumberT;
}();

var BooleanT = function () {
  function BooleanT(obj) {
    _classCallCheck(this, BooleanT);

    if (!obj.meta || obj.meta.kind !== "irreducible" || obj.meta.name !== "Boolean") {
      this._failed = true;
    }
    this._ref = obj;
    this.links = [];
  }

  _createClass(BooleanT, [{
    key: "getNextNodes",
    value: function getNextNodes() {
      return [];
    }
  }, {
    key: "canLink",
    value: function canLink() {
      return false;
    }
  }]);

  return BooleanT;
}();

var DateT = function () {
  function DateT(obj) {
    _classCallCheck(this, DateT);

    if (!obj.meta || obj.meta.kind !== "irreducible" || obj.meta.name !== "Boolean") {
      this._failed = true;
    }
    this._ref = obj;
    this.links = [];
  }

  _createClass(DateT, [{
    key: "getNextNodes",
    value: function getNextNodes() {
      return [];
    }
  }, {
    key: "canLink",
    value: function canLink() {
      return false;
    }
  }]);

  return DateT;
}();

function possibleClosure(constructor) {
  return function (state) {
    var workNodes = state.get("work");
    if (workNodes.size === 0) {
      return false;
    }
    var workNode = workNodes.last();
    return !new constructor(toJS(workNode))._failed;
  };
}

function updateClosure(constructor) {
  return function (state) {
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
  };
}

var actions = [{
  id: "data",
  possible: possibleClosure(DataT),
  updateState: updateClosure(DataT)
}, {
  id: "struct",
  possible: possibleClosure(StructT),
  updateState: updateClosure(StructT)
}, {
  id: "list",
  possible: possibleClosure(ListT),
  updateState: updateClosure(ListT)
}, {
  id: "refinement",
  possible: possibleClosure(RefinementT),
  updateState: updateClosure(RefinementT)
}, {
  id: "maybe",
  possible: possibleClosure(MaybeT),
  updateState: updateClosure(MaybeT)
}, {
  id: "enums",
  possible: possibleClosure(EnumsT),
  updateState: updateClosure(EnumsT)
}, {
  id: "string",
  possible: possibleClosure(StringT),
  updateState: updateClosure(StringT)
}, {
  id: "number",
  possible: possibleClosure(NumberT),
  updateState: updateClosure(NumberT)
}, {
  id: "boolean",
  possible: possibleClosure(BooleanT),
  updateState: updateClosure(BooleanT)
}, {
  id: "date",
  possible: possibleClosure(DateT),
  updateState: updateClosure(DateT)
}];

var positive = t.refinement(t.Num, function (x) {
  return x > 0;
}, "positive");
var form = t.struct({
  name: t.Str,
  address: t.Str,
  bacon: t.Num,
  ham: t.list(t.struct({
    last: t.maybe(positive)
  }, "ham3"))
}, "bacon");

var matchGen = plan(actions, { classified: [new StructT(form)], work: new StructT(form).getNextNodes() }, function (state) {
  return state.get("work").size === 0;
}, 1000);

var match = matchGen.next();
if (match.value) {
  var last = toJS(match.value[match.value.length - 1].state);

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = last.classified[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var expr1 = _step2.value;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = last.classified[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var expr2 = _step3.value;

          link(expr1, expr2);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  mapAbstractToActions(last.classified).map(function (action) {
    console.log(action.value.editor);
  });
  console.log(mapAbstractToActions(last.classified));
}

//console.log(JSON.stringify(toJS(last.state), null, 2))