"use strict";

var _actionConverter = require("../shared/action-converter");

var _actionConverter2 = _interopRequireDefault(_actionConverter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");

var app = express();

app.use(express.static(path.join(__dirname, "../client")));

app.post("/tcomb/structs/:structId", bodyParser.json(), function (req, res) {});

app.listen(5050);