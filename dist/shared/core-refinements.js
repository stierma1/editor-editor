"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pastDate = exports.futureDate = exports.negative = exports.zeroOrMore = exports.positive = exports.integer = exports.zipCode = exports.ipv4Address = exports.email = undefined;

var _tcombForm = require("tcomb-form");

var _tcombForm2 = _interopRequireDefault(_tcombForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var emailRegex = /(.)+@(.)+\.(.)+/g;
var email = exports.email = _tcombForm2.default.refinement(_tcombForm2.default.String, function (str) {
  return emailRegex.test(str);
}, "email");

var ipv4Address = exports.ipv4Address = _tcombForm2.default.refinement(_tcombForm2.default.String, function (str) {
  if (typeof str !== "string") {
    return false;
  }
  var split = str.split(".");
  if (split.length !== 4) {
    return false;
  }
  return parseInt(split[0]) < 256 && parseInt(split[0]) > -1 && parseInt(split[1]) < 256 && parseInt(split[1]) > -1 && parseInt(split[2]) < 256 && parseInt(split[2]) > -1 && parseInt(split[3]) < 256 && parseInt(split[3]) > -1;
}, "ipv4Address");

var zipRegex = /[0-9][0-9][0-9][0-9][0-9]/g;
var zipCode = exports.zipCode = _tcombForm2.default.refinement(_tcombForm2.default.String, function (str) {
  return zipRegex.test(str);
}, "zipCode");

var integer = exports.integer = _tcombForm2.default.refinement(_tcombForm2.default.Number, function (num) {
  return Math.floor(num) === num;
}, "integer");

var positive = exports.positive = _tcombForm2.default.refinement(_tcombForm2.default.Number, function (num) {
  return num > 0;
}, "positive");

var zeroOrMore = exports.zeroOrMore = _tcombForm2.default.refinement(_tcombForm2.default.Number, function (num) {
  return num >= 0;
}, "zeroOrMore");

var negative = exports.negative = _tcombForm2.default.refinement(_tcombForm2.default.Number, function (num) {
  return num < 0;
}, "negative");

var futureDate = exports.futureDate = _tcombForm2.default.refinement(_tcombForm2.default.Date, function (date) {
  return date > Date.now();
}, "futureDate");

var pastDate = exports.pastDate = _tcombForm2.default.refinement(_tcombForm2.default.Date, function (date) {
  return date < Date.now();
}, "pastDate");