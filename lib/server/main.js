var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
import plan from "../shared/action-converter"
var app = express();

app.use(express.static(path.join(__dirname , "../client")));

app.post("/tcomb/structs/:structId", bodyParser.json(), function(req, res){

});

app.listen(5050);
