"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Classified = function () {
  function Classified(label, obj) {
    _classCallCheck(this, Classified);

    this.label = label;
    this._rootRef = obj;
  }

  _createClass(Classified, [{
    key: "isIrreducible",
    value: function isIrreducible() {
      throw new Error("Must be implemented on extension");
    }
  }, {
    key: "getNextNodes",
    value: function getNextNodes() {
      throw new Error("Must be implemented on extension");
    }
  }, {
    key: "isValidClassification",
    value: function isValidClassification() {
      throw new Error("Must be implemented on extension");
    }
  }]);

  return Classified;
}();

exports.default = Classified;